// src/app/api/categories/public/get/subcategoryByURL/[categoryId]/[subcategoryURL]/route.js

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../../libs/firebaseAdmin'; // Asegúrate de que la ruta sea correcta

export async function GET(request, context) {
  const { params } = context;
  const { categoryId, subcategoryURL } = await params;

  try {
    // Verificar si la categoría existe
    const categoryRef = firestore.collection('categories').doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return NextResponse.json(
        { message: 'Categoría no encontrada.' },
        { status: 404 }
      );
    }

    // Consultar la subcategoría por URL
    const subcategoriesSnapshot = await categoryRef
      .collection('subCategories')
      .where('url', '==', subcategoryURL)
      .limit(1)
      .get();

    if (subcategoriesSnapshot.empty) {
      return NextResponse.json(
        { message: 'Subcategoría no encontrada.' },
        { status: 404 }
      );
    }

    const subcategoryDoc = subcategoriesSnapshot.docs[0];
    const subcategoryData = subcategoryDoc.data();

    return NextResponse.json(
      {
        subcategory: {
          uniqueID: subcategoryDoc.id,
          subcategoryID: subcategoryDoc.id, // Asegurando consistencia
          name: subcategoryData.name,
          url: subcategoryData.url,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching subcategory by URL:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
