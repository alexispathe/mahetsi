// src/app/api/favorites/getItems/route.js
import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found. Please login.' }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    const itemsSnapshot = await firestore.collection('favorites').doc(uid).collection('items').get();
    const favorites = [];
    itemsSnapshot.forEach(doc => {
      favorites.push(doc.id);
    });

    return NextResponse.json({ favorites }, { status: 200 });
  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
