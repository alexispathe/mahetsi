// src/app/api/roles/get/list/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, firestore } from '../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // Obtener las cookies de la solicitud
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar la sesión
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener el documento del usuario
    const userData = await getUserDocument(uid);
    const rolID = userData.rolID;

    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
    }

    // Obtener los roles desde Firestore
    const rolesSnapshot = await firestore.collection('roles').get();

    // Si no hay roles
    if (rolesSnapshot.empty) {
      return NextResponse.json({ message: 'No se encontraron roles' }, { status: 404 });
    }

    // Formatear los roles para la respuesta
    const roles = rolesSnapshot.docs.map(doc => ({
      rolID: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ roles }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener los roles:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
