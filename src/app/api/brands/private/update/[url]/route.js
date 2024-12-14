// src/app/api/brands/private/update/[url]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

export async function PUT(request, context) {
  // Espera a que `params` se resuelva
  const params = await context.params;
  const { url } = params; // Obtiene la propiedad url desde los parámetros
  console.log(params);

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

    // Obtener los datos de la marca
    const { name, description, categoryID } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'Nombre de la marca obligatorio.' }, { status: 400 });
    }

    if (!categoryID) {
      return NextResponse.json({ message: 'ID de categoría obligatorio.' }, { status: 400 });
    }

    // Verifica que la categoría exista
    const categoryDoc = await firestore.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    // Buscar la marca por la propiedad url
    const brandSnapshot = await firestore.collection('brands')
      .where('url', '==', url) // Busca por la propiedad url
      .limit(1) // Limita a un solo resultado
      .get();

    if (brandSnapshot.empty) {
      return NextResponse.json({ message: 'Marca no encontrada.' }, { status: 404 });
    }

    const brandDocRef = brandSnapshot.docs[0].ref; // Obtén la referencia del primer documento encontrado

    const brandData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      categoryID, // Actualiza la categoría asociada
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
    };

    await brandDocRef.update(brandData); // Actualiza el documento de la marca

    return NextResponse.json({ message: 'Marca actualizada exitosamente.' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar la marca:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
