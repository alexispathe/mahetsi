// src/app/api/addresses/private/setDefault/route.js
import { NextResponse } from 'next/server';
import { verifySessionCookie, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    const { addressId } = await request.json();

    // 1. Marcar todas las direcciones del usuario como isDefault = false
    const batch = firestore.batch();

    const userAddressesSnapshot = await firestore
      .collection('addresses')
      .where('ownerId', '==', uid)
      .get();

    userAddressesSnapshot.forEach(doc => {
      batch.update(doc.ref, { isDefault: false });
    });

    // 2. Marcar la dirección addressId => isDefault = true
    const addressSnapshot = await firestore
      .collection('addresses')
      .where('uniqueID', '==', addressId)
      .where('ownerId', '==', uid)
      .limit(1)
      .get();

    if (addressSnapshot.empty) {
      return NextResponse.json({ message: 'Dirección no encontrada' }, { status: 404 });
    }

    const addressDocRef = addressSnapshot.docs[0].ref;
    batch.update(addressDocRef, { isDefault: true });

    // 3. Ejecutar el batch
    await batch.commit();

    return NextResponse.json({ message: 'Dirección principal actualizada' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar la dirección principal:', error);
    return NextResponse.json({ message: 'Error al actualizar la dirección principal' }, { status: 500 });
  }
}
