import { NextResponse } from 'next/server';
import { firestore } from '@/libs/firebaseAdmin'; // Ajusta la ruta si tuvieras otra

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
        ...data,
        // Convertimos timestamps si quieres mostrarlos en ISO string
        dateCreated: data.dateCreated?.toDate().toISOString() || null,
        dateModified: data.dateModified?.toDate().toISOString() || null,
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
