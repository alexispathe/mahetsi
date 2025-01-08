// src/app/api/reviews/submit/route.js
import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

export async function POST(request) {
  try {
    const { orderId, productId, productName, rating, comment } = await request.json();

    // Validaciones básicas
    if (!orderId || !productId) {
      return NextResponse.json(
        { message: 'Faltan datos requeridos (orderId, productId)' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'La calificación (rating) debe ser entre 1 y 5.' },
        { status: 400 }
      );
    }

    // Obtener la session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
    }

    // Verificarla
    const decodedToken = await verifySessionCookie(sessionCookie);
    if (!decodedToken) {
      return NextResponse.json({ message: 'Token de sesión inválido.' }, { status: 401 });
    }

    // Obtener el uid del usuario
    const uid = decodedToken.uid;

    // Verificar que exista el usuario
    const userData = await getUserDocument(uid);
    if (!userData) {
      return NextResponse.json({ message: 'Datos de usuario no encontrados.' }, { status: 404 });
    }

    // Verificar si ya existe una reseña para este producto y orden por este usuario
    const existingReviewSnapshot = await firestore
      .collection('reviews')
      .where('ownerId', '==', uid)
      .where('orderId', '==', orderId)
      .where('productId', '==', productId)
      .limit(1)
      .get();

    if (!existingReviewSnapshot.empty) {
      return NextResponse.json(
        { message: 'Ya has dejado una reseña para este producto en esta orden.' },
        { status: 400 }
      );
    }

    // Crear el documento en la colección 'reviews'
    const newReviewRef = firestore.collection('reviews').doc();
    const now = admin.firestore.FieldValue.serverTimestamp();

    await newReviewRef.set({
      ownerId: uid,
      orderId,
      productId,
      productName: productName || '',
      rating,
      comment: comment || '',
      createdAt: now,
    });

    // ================================
    //   Actualizar averageRating y numReviews del producto
    // ================================
    // 1. Obtener todas las reseñas del producto
    const allReviewsSnap = await firestore
      .collection('reviews')
      .where('productId', '==', productId)
      .get();

    const allReviews = allReviewsSnap.docs.map((doc) => doc.data());
    const newNumReviews = allReviews.length;
    const sumRatings = allReviews.reduce((acc, review) => acc + review.rating, 0);
    const newAverageRating = sumRatings / newNumReviews;

    // 2. Actualizar el documento del producto
    await firestore.collection('products').doc(productId).update({
      averageRating: newAverageRating,
      numReviews: newNumReviews,
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: 'Reseña guardada exitosamente.' }, { status: 200 });
  } catch (error) {
    console.error('Error al guardar la reseña:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message || '' },
      { status: 500 }
    );
  }
}
