// src/app/api/orders/get/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, firestore } from '../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener las órdenes del usuario
    const ordersSnapshot = await firestore.collection('orders')
      .where('ownerId', '==', uid)
      .orderBy('dateCreated', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map(doc => ({
      ...doc.data(),
      dateCreated: doc.data().dateCreated.toDate(), // Convertir timestamp a Date
    }));
    console.log(orders)

    return NextResponse.json({ message: 'Órdenes obtenidas exitosamente.', orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}
