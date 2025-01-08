import { NextResponse } from 'next/server';
import { firestore } from '@/libs/firebaseAdmin'; // Ajusta la ruta según tu estructura

export async function GET() {
  try {
    // Consulta la colección 'products' y ordena por total_sales descendente
    // y limitamos a 5 registros
    const querySnapshot = await firestore
      .collection('products')
      .orderBy('totalSales', 'desc')
      .limit(5)
      .get();

    // Convertimos cada doc a un objeto JavaScript con solo las propiedades necesarias
    const bestSellers = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: data.name,
        price: data.price,
        images: data.images,
        uniqueID: data.uniqueID,
        url: data.url,
        averageRating: data.averageRating,
        numReviews: data.numReviews,
        totalSales: data.totalSales,
      };
    });

    return NextResponse.json({ bestSellers }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status: 500 }
    );
  }
}
