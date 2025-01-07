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
      return NextResponse.json({ message: 'Faltan datos requeridos (orderId, productId)' }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'La calificación (rating) debe ser entre 1 y 5.' }, { status: 400 });
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

    // Crear el doc en la colección 'reviews'
    const newReviewRef = firestore.collection('reviews').doc();
    const now = admin.firestore.FieldValue.serverTimestamp();

    await newReviewRef.set({
      ownerId: uid,
      orderId,
      productId,
      productName: productName || '',  // Opcional, por si quieres guardar el nombre
      rating,
      comment: comment || '',
      createdAt: now,
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
