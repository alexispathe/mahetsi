// src/app/api/cart/removeItem/route.js

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

    const { uniqueID} = await request.json();

    if (!uniqueID ) {
      return NextResponse.json({ error: 'uniqueID and size are required.' }, { status: 400 });
    }

    const itemRef = firestore.collection('carts').doc(uid).collection('items').doc(`${uniqueID}`);
    await itemRef.delete();

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
