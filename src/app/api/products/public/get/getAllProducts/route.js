// src/app/api/products/public/get/getAllProducts/route.js
//Devuelve todos los productos 
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Ajusta la ruta según tu proyecto

export async function GET(request) {
  try {
    // Obtener todos los productos de la colección 'products'
    const productsSnapshot = await firestore.collection('products').get();

    const products = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uniqueID: doc.id,
        name: data.name,
        price: data.price,
        categoryID: data.categoryID,
        brandID: data.brandID,
        typeID: data.typeID,
        size: data.size,
        images: data.images || [],
        url: data.url || '',
      };
    });

    return NextResponse.json(
      { products },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
