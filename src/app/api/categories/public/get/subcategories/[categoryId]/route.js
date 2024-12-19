// src/app/api/categories/public/get/subcategories/[categoryId]/route.js

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../libs/firebaseAdmin';

export async function GET(request, context) {
  const {params} = context;

  const { categoryId } = await params;

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

    // Obtener las subcategorías de la categoría específica
    const subcategoriesSnapshot = await categoryRef
      .collection('subCategories')
      .get();

    const subcategories = subcategoriesSnapshot.docs.map(subDoc => {
      const subData = subDoc.data();
      return {
        uniqueID: subDoc.id, // uniqueID de la subcategoría
        subcategoryID: subDoc.id, // Añadir subcategoryID para consistencia
        name: subData.name,
        url: subData.url,
      };
    });

    // Devolver la respuesta con las subcategorías
    return NextResponse.json(
      { subcategories },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener las subcategorías:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
