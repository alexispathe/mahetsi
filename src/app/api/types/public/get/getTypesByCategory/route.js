// src/app/api/types/public/get/getTypesByCategory/route.js
// Devuelve todos los tips para el filtro dependiendo de la categoria

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Asegúrate de que la ruta es correcta

export async function GET(request) {
  try {
    // Obtener los parámetros de la consulta
    const { searchParams } = new URL(request.url);
    const categoryID = searchParams.get('categoryID');

    if (!categoryID) {
      return NextResponse.json(
        { message: 'El parámetro categoryID es requerido.' },
        { status: 400 }
      );
    }

    // Obtener los types filtrados por categoryID
    const typesSnapshot = await firestore
      .collection('types')
      .where('categoryID', '==', categoryID)
      .get();

    const types = typesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uniqueID: doc.id, // ID único del type
        name: data.name,
        // Agrega otros campos si es necesario
      };
    });

    // Devolver la respuesta con los types filtrados
    return NextResponse.json(
      { types },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener los types:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
