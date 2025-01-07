// src/app/api/reviews/user/route.js
import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // Obtener la cookie
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

    const uid = decodedToken.uid;

    // Verificar que exista el usuario
    const userData = await getUserDocument(uid);
    if (!userData) {
      return NextResponse.json({ message: 'Datos de usuario no encontrados.' }, { status: 404 });
    }

    // Buscar sus reseñas
    const reviewsSnap = await firestore
      .collection('reviews')
      .where('ownerId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = reviewsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || null,
    }));

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener reseñas del usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message || '' },
      { status: 500 }
    );
  }
}
