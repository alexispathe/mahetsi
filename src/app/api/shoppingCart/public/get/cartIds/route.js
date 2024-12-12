// src/app/api/shoppingCart/public/get/cartIds/route.js

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Ajusta la ruta según tu estructura

export async function POST(request) {
  try {
    const { productIDs } = await request.json();

    if (!Array.isArray(productIDs)) {
      return NextResponse.json({ message: 'Los IDs de productos deben ser una lista.' }, { status: 400 });
    }

    if (productIDs.length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Firestore limita "in" a 10 elementos, así que dividimos la lista en chunks de 10
    const chunks = [];
    for (let i = 0; i < productIDs.length; i += 10) {
      chunks.push(productIDs.slice(i, i + 10));
    }

    const allProducts = [];

    for (const chunk of chunks) {
      const productsRef = firestore.collection('products');
      const querySnapshot = await productsRef.where('__name__', 'in', chunk).get();

      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          allProducts.push({
            uniqueID: doc.id,
            name: data.name,
            url: data.url,
            image: data.images[0] || '', // Asegurarse de que haya al menos una imagen
            price: data.price,
          });
        });
      }
    }

    return NextResponse.json({ products: allProducts }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener productos por IDs:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}