// src/app/api/types/private/get/type/[url]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request, context) {
  const { url } = context.params; // Obtiene la propiedad url desde los parámetros
  console.log('Parámetros:', context.params);

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

    // Buscar el tipo por la propiedad url
    const typeSnapshot = await firestore.collection('types')
      .where('url', '==', url)
      .limit(1)
      .get();

    if (typeSnapshot.empty) {
      return NextResponse.json({ message: 'Tipo no encontrado.' }, { status: 404 });
    }

    const typeData = typeSnapshot.docs[0].data();

    return NextResponse.json({
      message: 'Tipo obtenido exitosamente.',
      name: typeData.name,
      description: typeData.description || '',
      categoryID: typeData.categoryID || '',
      url: typeData.url,
      uniqueID: typeData.uniqueID,
      ownerId: typeData.ownerId,
      dateCreated: typeData.dateCreated,
      dateModified: typeData.dateModified,
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener el tipo:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
