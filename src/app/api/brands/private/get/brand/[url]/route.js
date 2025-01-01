// src/app/api/brands/private/get/brand/[url]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request, context) {
  // Espera a que `params` se resuelva
  const params = await context.params;
  const { url } = params; // Obtiene la propiedad url desde los parámetros
  try {
    // Obtener las cookies de la solicitud y esperar
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener el documento del usuario
    const userData = await getUserDocument(uid);
    const rolID = userData.rolID;

    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
    }

    // Obtener los permisos del rol
    const permissions = await getRolePermissions(rolID);

    // Verificar si el usuario tiene el permiso 'read'
    if (!permissions.includes('read')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "read".' }, { status: 403 });
    }

    // Buscar la marca por la propiedad url
    const brandSnapshot = await firestore.collection('brands')
      .where('url', '==', url)
      .limit(1)
      .get();

    if (brandSnapshot.empty) {
      return NextResponse.json({ message: 'Marca no encontrada.' }, { status: 404 });
    }

    const brandData = brandSnapshot.docs[0].data();

    return NextResponse.json({
      message: 'Marca obtenida exitosamente.',
      name: brandData.name,
      description: brandData.description || '',
      categoryID: brandData.categoryID || '',
      url: brandData.url,
      uniqueID: brandData.uniqueID,
      ownerId: brandData.ownerId,
      dateCreated: brandData.dateCreated,
      dateModified: brandData.dateModified,
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener la marca:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
