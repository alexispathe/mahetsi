// src/app/api/categories/private/subCategories/get/[categoryID]/[subCategoryID]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request, { params }) { // Asegúrate de que la función es async
  const { categoryID, subCategoryID } = params; // Desestructurar params

  try {
    // Obtener las cookies de la solicitud
    const cookieStore = cookies(); // Si Next.js requiere await, usa: const cookieStore = await cookies();
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

    // Buscar la subcategoría por subCategoryID en la categoría especificada
    const subcategoryDocRef = firestore.collection('categories').doc(categoryID).collection('subCategories').doc(subCategoryID);
    const subcategoryDoc = await subcategoryDocRef.get();

    if (!subcategoryDoc.exists) {
      return NextResponse.json({ message: 'Subcategoría no encontrada.' }, { status: 404 });
    }

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
    const errorMessage = error?.message || 'Unknown error';
    return NextResponse.json({ message: 'Error interno del servidor.', error: errorMessage }, { status: 500 });
  }
}
