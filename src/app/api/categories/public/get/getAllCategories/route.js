// src/app/api/categories/public/get/getAllCategories/route.js
//Esta api sirve para devolver todas las categorias para el filtro

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Asegúrate de que la ruta es correcta

export async function GET(request) {
  try {
    // 1. Obtener todas las categorías
    const categoriesSnapshot = await firestore.collection('categories').get();

    const categories = categoriesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uniqueID: doc.id, // ID único de la categoría
        name: data.name,
        url: data.url,
      };
    });

    // 2. Devolver la respuesta con las categorías
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
