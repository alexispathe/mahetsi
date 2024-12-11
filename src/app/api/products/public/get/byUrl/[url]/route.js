// src/app/api/products/public/get/byUrl/[url]/route.js

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../libs/firebaseAdmin';

export async function GET(request, { params }) {
  const { url } = params; // Obtener el parámetro 'url' de la ruta
  console.log(`Obteniendo detalles del producto para la URL: ${url}`);

  try {
    // Buscar el producto por su URL
    const productsRef = firestore.collection('products');
    const querySnapshot = await productsRef.where('url', '==', url).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'Producto no encontrado.' }, { status: 404 });
    }

    // Asumimos que la URL es única y obtenemos el primer documento
    const productDoc = querySnapshot.docs[0];
    const productData = {
      uniqueID: productDoc.id,
      ...productDoc.data(),
    };

    // Obtener información adicional como marca y tipo
    const brandRef = firestore.collection('brands').doc(productData.brandID);
    const brandDoc = await brandRef.get();
    const brandName = brandDoc.exists ? brandDoc.data().name : '';

    const typeRef = firestore.collection('types').doc(productData.typeID);
    const typeDoc = await typeRef.get();
    const typeName = typeDoc.exists ? typeDoc.data().name : '';

    // Construir la respuesta
    const responseData = {
      product: {
        uniqueID: productData.uniqueID,
        name: productData.name,
        price: productData.price,
        images: productData.images,
        brandID: productData.brandID,
        typeID: productData.typeID,
        url: productData.url,
        numReviews: productData.numReviews || 0,
        description: productData.description || '',
        // Agrega otros campos según tus necesidades
      },
      brandName,
      typeName,
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Error al obtener los detalles del producto:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
