// app/api/products/public/get/top-rated
import { NextResponse } from 'next/server';
import { firestore } from '@/libs/firebaseAdmin'; 

export async function GET() {
  try {
    // Consulta la colección 'products' y ordena por averageRating desc
    const querySnapshot = await firestore
      .collection('products')
      .orderBy('averageRating', 'desc')
      .get();

    // Mapeamos los documentos a objetos
    const products = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: data.name,
        price: data.price,
        images: data.images,
        uniqueID: data.uniqueID,
        url: data.url,
        averageRating: data.averageRating,
        numReviews: data.numReviews,
      };
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos top-rated:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status: 500 }
    );
  }
}
