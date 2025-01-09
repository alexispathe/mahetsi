// src/app/api/addresses/private/create/route.js
import { NextResponse } from 'next/server';
import { verifySessionCookie, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';
import { userAddressSchema } from '@/schemas/userAddressSchema';
import admin from 'firebase-admin';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar sesión
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener datos del body
    const body = await request.json();
    // Validar con zod
    const parsedData = userAddressSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ message: 'Datos inválidos', errors: parsedData.error.errors }, { status: 400 });
    }

    const addressData = parsedData.data;

    // Checar si es la primera dirección
    const userAddresses = await firestore
      .collection('addresses')
      .where('ownerId', '==', uid)
      .get();

    const isFirstAddress = userAddresses.empty;

    // Crear doc
    const docRef = firestore.collection('addresses').doc();
    const newAddress = {
      ...addressData,
      ownerId: uid,
      uniqueID: docRef.id,
      isDefault: isFirstAddress ? true : false,
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(newAddress);

    return NextResponse.json({ message: 'Dirección creada exitosamente' }, { status: 200 });

  } catch (error) {
    console.error('Error al crear la dirección:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
