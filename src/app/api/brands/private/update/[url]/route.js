// src/app/api/brands/update/[url]/route.js

import { NextResponse } from 'next/server';
import { firestore, verifyIdToken } from '../../../../../libs/firebaseAdmin';
import admin from 'firebase-admin';

export async function PUT(request, { params }) {
  const { url } = params; // Obtiene la propiedad url desde los parámetros
  console.log(params);

  try {
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(idToken); // Verifica el token del usuario

    const ownerId = decodedToken.uid; // El ID del usuario actual

    const { name, description, categoryID } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'Nombre de la marca obligatorio.' }, { status: 400 });
    }

    if (!categoryID) {
      return NextResponse.json({ message: 'ID de categoría obligatorio.' }, { status: 400 });
    }

    // Verifica que la categoría exista
    const categoryDoc = await firestore.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    // Buscar la marca por la propiedad url
    const brandSnapshot = await firestore.collection('brands')
      .where('url', '==', url) // Busca por la propiedad url
      .limit(1) // Limita a un solo resultado
      .get();

    if (brandSnapshot.empty) {
      return NextResponse.json({ message: 'Marca no encontrada.' }, { status: 404 });
    }

    const brandDocRef = brandSnapshot.docs[0].ref; // Obtén la referencia del primer documento encontrado

    const brandData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      categoryID, // Actualiza la categoría asociada
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
    };

    await brandDocRef.update(brandData); // Actualiza el documento de la marca

    return NextResponse.json({ message: 'Marca actualizada exitosamente.' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar la marca:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
