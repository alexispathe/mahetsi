// src/app/api/categories/private/subCategories/get/list/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../../libs/firebaseAdmin';
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

    // Verificar si el usuario tiene el permiso 'read' para subcategorías
    if (!permissions.includes('read')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "read".' }, { status: 403 });
    }

    // Obtener todas las categorías desde Firestore
    const categoriesSnapshot = await firestore.collection('categories').get();

    // Crear un array para almacenar las subcategorías de todas las categorías
    const allSubcategories = [];

    // Recorrer cada categoría y obtener sus subcategorías
    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryId = categoryDoc.id;

      // Obtener las subcategorías de la subcolección de esta categoría
      const subcategoriesSnapshot = await firestore.collection('categories').doc(categoryId).collection('subCategories').get();
      const subcategories = subcategoriesSnapshot.docs.map(doc => doc.data());

      // Añadir las subcategorías al array
      allSubcategories.push(...subcategories);
    }

    return NextResponse.json({
      message: 'Subcategorías obtenidas exitosamente.',
      subcategories: allSubcategories,
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener las subcategorías:', error);
    const errorMessage = error?.message || 'Error interno del servidor.';
    return NextResponse.json({ message: 'Error interno del servidor.', error: errorMessage }, { status: 500 });
  }
}
