// src/app/api/addresses/private/update/[addressId]/route.js
import { NextResponse } from 'next/server';
import { verifySessionCookie, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import { userAddressSchema } from '@/schemas/userAddressSchema';
import admin from 'firebase-admin'; // Asegúrate de que admin está inicializado

export async function PUT(request, context) {
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

    // Obtener los datos de la dirección desde el cuerpo de la solicitud
    const body = await request.json();

    // Validar los datos con zod
    const parsedData = userAddressSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ message: 'Datos inválidos', errors: parsedData.error.errors }, { status: 400 });
    }

    const addressData = parsedData.data;

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

    const updatedAddressData = {
      ...addressData,
      // si no manejas isDefault aquí, no lo sobreescribas
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
    };

    await addressDocRef.update(updatedAddressData); // Actualizar el documento de la dirección

    return NextResponse.json({ message: 'Dirección actualizada exitosamente.' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar la dirección:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
