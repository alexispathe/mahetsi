// src/app/api/cart/sync/route.js

import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // Esperar a que las cookies se resuelvan
    const cookieStore = await cookies(); // Asegúrate de usar 'await'
    const sessionCookie = cookieStore.get('session')?.value;

    console.log('Session Cookie:', sessionCookie); // Para depuración

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found. Please login.' }, { status: 401 });
    }

    // Verificar la cookie de sesión
    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    // Obtener los ítems a sincronizar
    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items format.' }, { status: 400 });
    }

    // Crear un batch para las operaciones de Firestore
    const batch = firestore.batch();

    items.forEach((item) => {
      const { uniqueID, size, qty } = item;
      if (!uniqueID || !size || !qty) return; // Omite ítems inválidos

      const itemRef = firestore
        .collection('carts')
        .doc(uid)
        .collection('items')
        .doc(`${uniqueID}_${size}`);

      batch.set(
        itemRef,
        {
          uniqueID,
          size,
          qty,
          updatedAt: new Date(),
        },
        { merge: true } // Merge para actualizar si existe
      );
    });

    // Ejecutar el batch
    await batch.commit();

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error syncing cart:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
