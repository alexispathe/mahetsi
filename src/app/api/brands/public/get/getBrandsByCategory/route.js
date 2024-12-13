// src/app/api/brands/public/get/getBrandsByCategory/route.js
// Devuelve todos las marcas para el filtro dependiendo de la categoria
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Asegúrate de que la ruta es correcta

export async function GET(request) {
  try {
    // Utilizar request.nextUrl en lugar de new URL(request.url)
    const { searchParams } = request.nextUrl;
    const categoryID = searchParams.get('categoryID');

    if (!categoryID) {
      return NextResponse.json(
        { message: 'El parámetro categoryID es requerido.' },
        { status: 400 }
      );
    }

    // Obtener los brands filtrados por categoryID
    const brandsSnapshot = await firestore
      .collection('brands')
      .where('categoryID', '==', categoryID)
      .get();

    const brands = brandsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uniqueID: doc.id, // ID único del brand
        name: data.name,
        // Agrega otros campos si es necesario
      };
    });

    // Devolver la respuesta con los brands filtrados
    return NextResponse.json(
      { brands },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener los brands:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
