// src/app/api/sessionLogin/route.js

import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

// Asegúrate de que Firebase Admin esté inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export async function POST(request) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { idToken, items, favorites } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'No ID token provided' }, { status: 400 });
    }

    // Crear la sesión de usuario
    const expiresInMilliseconds = 24 * 60 * 60 * 1000; // 1 día en ms
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn: expiresInMilliseconds });

    // Verificar el token para obtener la información del usuario
    const decodedToken = await authAdmin.verifySessionCookie(sessionCookie, true);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Sesion expirada o no válida' }, { status: 401 });
    }

    const { uid, displayName, email } = decodedToken;
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
    } else {
      await userRef.update({ dateModified: admin.firestore.FieldValue.serverTimestamp() });
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

    // Sincronizar los favoritos si se proporcionan
    if (Array.isArray(favorites) && favorites.length > 0) {
      const batch = firestore.batch();
      favorites.forEach((uniqueID) => {
        const favRef = firestore.collection('favorites').doc(uid).collection('items').doc(uniqueID);
        batch.set(
          favRef,
          {
            uniqueID,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      console.log('Favoritos sincronizados exitosamente.');
    }

    // Configurar la cookie de sesión
    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción la cookie será segura
      path: '/',
      maxAge: 60 * 60 , // 1 día en segundos
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error setting session cookie:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
