// src/app/api/categories/public/get/list/route.js
//Devuelve las categorias y subcategorias para mostrarlo en la pagina para el usuario final
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin';

export async function GET(request) {
  try {
    // 1. Obtener todas las categorías
    const categoriesSnapshot = await firestore.collection('categories').get();

    const categories = [];

    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      const categoryId = categoryDoc.id; // uniqueID de la categoría

      // 2. Obtener las subcategorías de cada categoría
      const subcategoriesSnapshot = await firestore
        .collection('categories')
        .doc(categoryId)
        .collection('subCategories')
        .get();

      const subcategories = subcategoriesSnapshot.docs.map(subDoc => {
        const subData = subDoc.data();
        return {
          uniqueID: subDoc.id, // uniqueID de la subcategoría
          name: subData.name,
          url: subData.url,
        };
      });

      categories.push({
        uniqueID: categoryId, // Agregar uniqueID a la categoría
        name: categoryData.name,
        image: categoryData.image,
        url: categoryData.url,
        subcategories: subcategories.length > 0 ? subcategories : null,
      });
    }

    // 3. Devolver la respuesta con las categorías y subcategorías
    return NextResponse.json(
      { categories },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener las categorías públicas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

