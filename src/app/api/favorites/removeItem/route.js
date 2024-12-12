// src/app/api/favorites/removeItem/route.js
import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies(); 
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found. Please login.' }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    const { uniqueID } = await request.json();
    if (!uniqueID) {
      return NextResponse.json({ error: 'uniqueID is required.' }, { status: 400 });
    }

    const favRef = firestore.collection('favorites').doc(uid).collection('items').doc(uniqueID);
    await favRef.delete();

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
