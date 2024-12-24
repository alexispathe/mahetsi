// src/app/api/categories/public/get/subcategoryByURL/[categoryId]/[subcategoryURL]/route.js
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../../libs/firebaseAdmin';

export async function GET(request, context) {
  const { params } = context;
  const { categoryId, subcategoryURL } = await params;

  try {
    // Verificar si la categoría existe
    const categoryRef = firestore.collection('categories').doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return NextResponse.json(
        { subcategory: [] },  // Devuelve un arreglo vacío si no se encuentra la categoría
        { status: 200 }
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
        { subcategory: [] },  // Devuelve un arreglo vacío si no se encuentra la subcategoría
        { status: 200 }
      );
    }

    const subcategoryDoc = subcategoriesSnapshot.docs[0];
    const subcategoryData = subcategoryDoc.data();

    return NextResponse.json(
      {
        subcategory: [
          {
            uniqueID: subcategoryDoc.id,
            subcategoryID: subcategoryDoc.id, // Asegurando consistencia
            name: subcategoryData.name,
            url: subcategoryData.url,
          },
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching subcategory by URL:', error);
    return NextResponse.json(
      { subcategory: [] },  // En caso de error, también devuelve un arreglo vacío
      { status: 500 }
    );
  }
}
