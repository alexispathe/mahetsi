// src/app/api/addresses/private/get/list/route.js
import { NextResponse } from 'next/server';
import { verifySessionCookie, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener todas las direcciones del usuario
    const addressesSnapshot = await firestore.collection('addresses')
      .where('ownerId', '==', uid)
      .get();

    const addresses = addressesSnapshot.docs.map(doc => doc.data());

    return NextResponse.json({
      message: 'Direcciones obtenidas exitosamente.',
      addresses,
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener las direcciones:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}

