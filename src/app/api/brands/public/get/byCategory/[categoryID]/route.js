import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../libs/firebaseAdmin';

export async function GET(request, { params }) {
  const { categoryID } = params; // Obtiene la propiedad categoryID desde los parámetros
  console.log("Obteniendo brands para la categoría:", categoryID);

  try {
    // Verifica que la categoría exista
    const categoryDoc = await firestore.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    // Obtener las marcas asociadas a la categoría
    const brandsSnapshot = await firestore.collection('brands')
      .where('categoryID', '==', categoryID)
      .get();

    const brands = [];
    brandsSnapshot.forEach(doc => {
      brands.push({
        uniqueID: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json({ brands }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener las marcas:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
