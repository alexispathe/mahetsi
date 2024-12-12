// src/app/api/products/public/get/favorites/route.js
//Esta api sirve para hacer la seleccion de los productos favoritos por los clientes para mostrarlos dentro del carrusel
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Ajusta la ruta según tu estructura

export async function POST(request) {
  try {
    const { favoriteIDs } = await request.json();

    if (!Array.isArray(favoriteIDs)) {
      return NextResponse.json({ message: 'Los IDs de favoritos deben ser una lista.' }, { status: 400 });
    }

    if (favoriteIDs.length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Consultar Firestore para obtener los productos que coincidan con los IDs proporcionados
    const productsRef = firestore.collection('products');
    const querySnapshot = await productsRef.where('__name__', 'in', favoriteIDs.slice(0, 10)).get(); // Firestore limita "in" a 10 elementos

    if (querySnapshot.empty) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const products = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      products.push({
        uniqueID: doc.id,
        name: data.name,
        url: data.url,
        image: data.images[0] || '', // Asegurarse de que haya al menos una imagen
        price: data.price,
      });
    });

    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener productos favoritos:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
