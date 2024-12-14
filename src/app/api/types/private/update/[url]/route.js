// src/app/api/types/private/update/[url]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

export async function PUT(request, context) {
  const { url } = context.params; // Obtiene la propiedad url desde los parámetros
  console.log('Parámetros:', context.params);

  try {
    // Obtener las cookies de la solicitud y esperar
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

    // Obtener los datos del tipo
    const { name, description, categoryID } = await request.json();

    // Validaciones básicas
    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'Nombre del tipo obligatorio.' }, { status: 400 });
    }

    if (!categoryID) {
      return NextResponse.json({ message: 'ID de categoría obligatorio.' }, { status: 400 });
    }

    // Verifica que la categoría exista
    const categoryDoc = await firestore.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    // Buscar el tipo por la propiedad url
    const typeSnapshot = await firestore.collection('types')
      .where('url', '==', url) // Busca por la propiedad url
      .limit(1) // Limita a un solo resultado
      .get();

    if (typeSnapshot.empty) {
      return NextResponse.json({ message: 'Tipo no encontrado.' }, { status: 404 });
    }

    const typeDocRef = typeSnapshot.docs[0].ref; // Obtén la referencia del primer documento encontrado

    const typeData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      categoryID, // Actualiza la categoría asociada
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
    };

    await typeDocRef.update(typeData); // Actualiza el documento del tipo

    return NextResponse.json({ message: 'Tipo actualizado exitosamente.' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar el tipo:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
