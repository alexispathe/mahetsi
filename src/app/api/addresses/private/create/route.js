// src/app/api/addresses/private/create/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, firestore } from '../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import { userAddressSchema } from '@/schemas/userAddressSchema';
import admin from 'firebase-admin'; // Asegúrate de que admin está inicializado

export async function POST(request) {
  try {
    // Obtener las cookies de la solicitud
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener los datos de la dirección desde el cuerpo de la solicitud
    const body = await request.json();

    // Validar los datos con zod
    const parsedData = userAddressSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ message: 'Datos inválidos', errors: parsedData.error.errors }, { status: 400 });
    }

    const addressData = parsedData.data;

    // Crear una referencia a un nuevo documento en 'addresses'
    const addressDocRef = firestore.collection('addresses').doc();

    const newAddress = {
      ...addressData,
      uniqueID: addressDocRef.id,
      ownerId: uid,
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
    };

    await addressDocRef.set(newAddress); // Guardar dirección en Firestore

    return NextResponse.json({ message: 'Dirección creada exitosamente.', uniqueID: addressDocRef.id }, { status: 201 });

  } catch (error) {
    console.error('Error al crear la dirección:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
