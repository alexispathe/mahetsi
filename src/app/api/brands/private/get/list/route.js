// src/app/api/brands/private/get/list/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // Obtener las cookies de la solicitud
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      // Usuario no autenticado
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Verificar la cookie de sesión
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener datos del usuario desde Firestore
    const userData = await getUserDocument(uid);
    const rolID = userData?.rolID;

    if (!rolID) {
      // Usuario sin rol asignado
      return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
    }

    // Obtener permisos del rol
    const permissions = await getRolePermissions(rolID);

    // Verificar si el usuario tiene el permiso 'read' para brands
    if (!permissions.includes('read')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "read".' }, { status: 403 });
    }

    // Obtener todas las marcas desde Firestore
    const brandsSnapshot = await firestore.collection('brands').get();
    const brands = brandsSnapshot.docs.map(doc => doc.data());

    return NextResponse.json({
      message: 'Marcas obtenidas exitosamente.',
      brands,
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener las marcas:', error);
    const errorMessage = error?.message || 'Error interno del servidor.';
    return NextResponse.json({ message: 'Error interno del servidor.', error: errorMessage }, { status: 500 });
  }
}
