// src/app/api/cart/getItems/route.js

import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET() {
  console.log("Solicitud recibida en la API /cart/getItems"); // Verifica si está llegando a la API
  
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Por favor inicie sesion' }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    const itemsSnapshot = await firestore.collection('carts').doc(uid).collection('items').get();
    const cartItems = [];
    itemsSnapshot.forEach(doc => {
      cartItems.push({ ...doc.data() });
    });

    return NextResponse.json({ cartItems }, { status: 200 });
  } catch (error) {
    console.error('Error getting cart items:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
