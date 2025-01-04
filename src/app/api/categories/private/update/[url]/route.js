// src/app/api/categories/private/update/[url]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

// Función para validar URLs
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export async function PUT(request, context) {
  const params = context.params;
  const { url } = params; // Obtener el parámetro dinámico 'url'

  try {
    // Obtener las cookies de la solicitud de manera síncrona
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
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

    // Verificar si el usuario tiene el permiso 'update'
    if (!permissions.includes('update')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "update".' }, { status: 403 });
    }

    // Obtener los datos de la categoría
    const { name, description, image } = await request.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ message: 'Nombre de la categoría obligatorio.' }, { status: 400 });
    }

    // Validar la URL de la imagen si se proporciona
    if (image && !isValidUrl(image)) {
      return NextResponse.json({ message: 'URL de la imagen no válida.' }, { status: 400 });
    }

    // Buscar la categoría por la propiedad url
    const categorySnapshot = await firestore.collection('categories')
      .where('url', '==', url)
      .limit(1)
      .get();

    if (categorySnapshot.empty) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    const categoryDocRef = categorySnapshot.docs[0].ref; // Obtener la referencia del documento

    const updatedCategoryData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
      image: image ? image.trim() : '', // Añade o actualiza la URL de la imagen si se proporciona
    };

    await categoryDocRef.update(updatedCategoryData); // Actualizar el documento de la categoría

    return NextResponse.json({ message: 'Categoría actualizada exitosamente.' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
