// src/app/api/products/public/get/getProductsByCategory/route.js

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Asegúrate de que la ruta es correcta

export async function GET(request) {
  try {
    // Obtener los parámetros de la consulta
    const { searchParams } = new URL(request.url);
    const categoryID = searchParams.get('categoryID');

    if (!categoryID) {
      return NextResponse.json(
        { message: 'El parámetro categoryID es requerido.' },
        { status: 400 }
      );
    }

    // Obtener los productos filtrados por categoryID
    const productsSnapshot = await firestore
      .collection('products')
      .where('categoryID', '==', categoryID)
      .get();

    const products = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uniqueID: doc.id, // ID único del producto
        name: data.name,
        price: data.price,
        categoryID: data.categoryID,
        brandID: data.brandID,
        typeID: data.typeID,
        size: data.size,
        images: data.images
        // Agrega otros campos si es necesario
      };
    });

    // Devolver la respuesta con los productos filtrados
    return NextResponse.json(
      { products },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
