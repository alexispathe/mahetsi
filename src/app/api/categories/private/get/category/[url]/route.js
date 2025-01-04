// src/app/api/categories/private/get/category/[url]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request, context) {
  // Espera a que `params` se resuelva
  const paramData = await context.params;
  const { url } = paramData;
  try {
    // Espera a que las cookies se obtengan
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

    // Buscar la categoría por la propiedad url
    const categorySnapshot = await firestore.collection('categories')
      .where('url', '==', url)
      .limit(1)
      .get();
    if (categorySnapshot.empty) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    const categoryData = categorySnapshot.docs[0].data();

    return NextResponse.json({
      message: 'Categoría obtenida exitosamente.',
      name: categoryData.name,
      description: categoryData.description || '',
      url: categoryData.url,
      uniqueID: categoryData.uniqueID,
      ownerId: categoryData.ownerId,
      dateCreated: categoryData.dateCreated,
      dateModified: categoryData.dateModified,
      image: categoryData.image
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
