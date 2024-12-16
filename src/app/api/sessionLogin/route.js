// src/app/api/sessionLogin/route.js

import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

export async function POST(request) {
  try {
    const { idToken, items } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'No ID token provided' }, { status: 400 });
    }

    // Crear la sesión
    const expiresInMilliseconds = 24 * 60 * 60 * 1000; // 1 día en ms
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn: expiresInMilliseconds });

    // Verificar el token para obtener la información del usuario
    const decodedToken = await authAdmin.verifySessionCookie(sessionCookie, true);
    const { uid, displayName, email } = decodedToken;

    // Referencia al documento del usuario en Firestore
    const userRef = firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();

    // Si el documento no existe, crearlo
    if (!userDoc.exists) {
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      await userRef.set({
        name: displayName || '',
        email: email || '',
        dateCreated: timestamp,
        dateModified: timestamp,
        rolID: "gB4kyZZNT8HLbsyTBRGi", 
        ownerId: uid,
      });
      console.log(`Usuario ${uid} creado en Firestore.`);
    } else {
      console.log(`Usuario ${uid} ya existe en Firestore.`);
      // Actualizar el campo dateModified
      await userRef.update({
        dateModified: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Sincronizar el carrito si se proporcionan ítems
    if (Array.isArray(items) && items.length > 0) {
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
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true } // Merge para actualizar si existe
        );
      });

      await batch.commit();
      console.log('Carrito sincronizado exitosamente.');
    }

    // Configurar la cookie de sesión
    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción la cookie será segura
      path: '/',
      maxAge: 60 * 60 * 24, // 1 día en segundos
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error setting session cookie:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
