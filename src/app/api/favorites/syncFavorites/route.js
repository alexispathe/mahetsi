// src/app/api/favorites/syncFavorites/route.js

import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found. Please login.' }, { status: 401 });
    }

    // Verificar la cookie de sesión
    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    const { favorites } = await request.json();
    if (!Array.isArray(favorites)) {
      return NextResponse.json({ error: 'Favorites must be an array of uniqueIDs.' }, { status: 400 });
    }

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
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error sincronizando favoritos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
