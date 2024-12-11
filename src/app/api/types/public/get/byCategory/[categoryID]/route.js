// src/app/api/types/public/get/byCategory/[categoryID]/route.js

import { NextResponse } from 'next/server';
import { firestore, verifyIdToken } from '../../../../../../libs/firebaseAdmin';

export async function GET(request, { params }) {
  const { categoryID } = params; // Obtiene la propiedad categoryID desde los parámetros
  console.log("Obteniendo types para la categoría:", categoryID);

  try {
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    await verifyIdToken(idToken); // Verifica el token del usuario

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
