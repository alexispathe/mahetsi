// src/app/api/cart/addItem/route.js
// Agrega los productos al carrito de compras dependidendo del id del usuario
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

    const { uniqueID, qty = 1 } = await request.json();
    if (!uniqueID ) {
      return NextResponse.json({ error: 'uniqueID is required.' }, { status: 400 });
    }

    const itemRef = firestore.collection('carts').doc(uid).collection('items').doc(`${uniqueID}`);
    const itemDoc = await itemRef.get();

    if (itemDoc.exists) {
      const newQty = itemDoc.data().qty + qty;
      if (newQty > 0) {
        await itemRef.update({
          qty: newQty,
          updatedAt: new Date()
        });
      } else {
        // Si la nueva cantidad es 0 o menor, eliminar el item
        await itemRef.delete();
      }
    } else {
      if (qty > 0) {
        await itemRef.set({
          uniqueID,
          qty,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      // Si qty <= 0 y el item no existe, no hacemos nada
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
