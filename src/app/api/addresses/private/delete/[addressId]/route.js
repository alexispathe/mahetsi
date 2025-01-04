// src/app/api/addresses/private/delete/[addressId]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function DELETE(request, context) {
  const params = context.params;
  const { addressId } = params; // Obtener el parámetro dinámico 'addressId'

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Buscar la dirección por uniqueID y ownerId
    const addressSnapshot = await firestore.collection('addresses')
      .where('uniqueID', '==', addressId)
      .where('ownerId', '==', uid)
      .limit(1)
      .get();

    if (addressSnapshot.empty) {
      return NextResponse.json({ message: 'Dirección no encontrada.' }, { status: 404 });
    }

    const addressDocRef = addressSnapshot.docs[0].ref; // Obtener la referencia del documento

    await addressDocRef.delete(); // Eliminar la dirección

    return NextResponse.json({ message: 'Dirección eliminada exitosamente.' }, { status: 200 });

  } catch (error) {
    console.error('Error al eliminar la dirección:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
