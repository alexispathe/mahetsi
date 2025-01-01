// src/app/api/categories/private/subCategories/get/[categoryURL]/[subCategoryURL]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request,  context ) { // Asegúrate de que la función es async
  const params = await context.params;
  const { categoryURL, subCategoryURL } = params; // Desestructurar params

  try {
    // Obtener las cookies de la solicitud
    const cookieStore = await  cookies(); // Si Next.js requiere await, usa: const cookieStore = await cookies();
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

    // Buscar la categoría por categoryURL
    const categoryDocSnapshot = await firestore.collection('categories').where('url', '==', categoryURL).get();

    if (categoryDocSnapshot.empty) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    const categoryDoc = categoryDocSnapshot.docs[0];

    // Buscar la subcategoría en la subcolección de subcategorías usando subCategoryURL
    const subcategoryDocSnapshot = await firestore
      .collection('categories')
      .doc(categoryDoc.id)
      .collection('subCategories')
      .where('url', '==', subCategoryURL)
      .get();

    if (subcategoryDocSnapshot.empty) {
      return NextResponse.json({ message: 'Subcategoría no encontrada.' }, { status: 404 });
    }

    const subcategoryDoc = subcategoryDocSnapshot.docs[0];
    const subcategoryData = subcategoryDoc.data();

    return NextResponse.json({
      message: 'Subcategoría obtenida exitosamente.',
      name: subcategoryData.name,
      description: subcategoryData.description || '',
      categoryID: subcategoryData.categoryID,
      url: subcategoryData.url,
      subCategoryID: subcategoryData.subCategoryID,
      ownerId: subcategoryData.ownerId,
      dateCreated: subcategoryData.dateCreated,
      dateModified: subcategoryData.dateModified,
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener la subcategoría:', error);
    const errorMessage = error?.message || 'Error desconocido';
    return NextResponse.json({ message: 'Error interno del servidor.', error: errorMessage }, { status: 500 });
  }
}
