// src/app/api/favorites/checkItem/route.js
import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uniqueID = searchParams.get('uniqueID');

    if (!uniqueID) {
      return NextResponse.json({ error: 'uniqueID query param is required.' }, { status: 400 });
    }

    const cookieStore = await cookies(); 
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      // Si no hay sesión, no puede tener favoritos
      return NextResponse.json({ isFavorite: false }, { status: 200 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    const favRef = firestore.collection('favorites').doc(uid).collection('items').doc(uniqueID);
    const docSnap = await favRef.get();
    const isFavorite = docSnap.exists;

    return NextResponse.json({ isFavorite }, { status: 200 });
  } catch (error) {
    console.error('Error checking favorite item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
