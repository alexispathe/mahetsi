// src/app/api/types/public/get/byCategory/[categoryID]/route.js
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../libs/firebaseAdmin';

export async function GET(request, { params }) {
  const { categoryID } = params; // Obtiene la propiedad categoryID desde los parámetros
  console.log("Obteniendo types para la categoría:", categoryID);

  try {
    // Verifica que la categoría exista
    const categoryDoc = await firestore.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    // Obtener los tipos asociados a la categoría
    const typesSnapshot = await firestore.collection('types')
      .where('categoryID', '==', categoryID)
      .get();

    const types = [];
    typesSnapshot.forEach(doc => {
      types.push({
        uniqueID: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json({ types }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener los tipos:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
