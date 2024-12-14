// src/app/api/categories/private/subCategories/get/list/[categoryID]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  const { categoryID } = params;

  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    const userData = await getUserDocument(uid);
    const rolID = userData?.rolID;

    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
    }

    const permissions = await getRolePermissions(rolID);

    if (!permissions.includes('read')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "read".' }, { status: 403 });
    }

    const subcategoriesSnapshot = await firestore.collection('categories').doc(categoryID).collection('subCategories').get();
    const subcategories = subcategoriesSnapshot.docs.map(doc => doc.data());

    return NextResponse.json({
      message: 'Subcategorías obtenidas exitosamente.',
      subcategories,
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener las subcategorías:', error);
    const errorMessage = error?.message || 'Unknown error';
    return NextResponse.json({ message: 'Error interno del servidor.', error: errorMessage }, { status: 500 });
  }
}
