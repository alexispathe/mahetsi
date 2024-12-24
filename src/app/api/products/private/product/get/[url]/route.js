// src/app/api/products/private/product/get/[url]/route.js

import { NextResponse } from 'next/server';
import { firestore, verifySessionCookie } from '../../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  const { url } = params;

  try {
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { message: 'URL de producto inválida.' },
        { status: 400 }
      );
    }

    // Obtener las cookies de la solicitud
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'No autorizado.' },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await verifySessionCookie(sessionCookie);
    } catch (tokenError) {
      return NextResponse.json(
        { message: 'Token de autenticación inválido.' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // Buscar el producto por 'url'
    const productQuery = await firestore
      .collection('products')
      .where('url', '==', url)
      .limit(1)
      .get();

    if (productQuery.empty) {
      return NextResponse.json(
        { message: 'Producto no encontrado.' },
        { status: 404 }
      );
    }

    const productDoc = productQuery.docs[0];
    const productData = productDoc.data();

    // Verificar permisos (opcional, dependiendo de tu lógica)
    // Por ejemplo, solo el propietario puede ver el producto
    if (productData.ownerId !== userId) {
      return NextResponse.json(
        { message: 'No tienes permisos para ver este producto.' },
        { status: 403 }
      );
    }

    // Devolver los datos del producto
    return NextResponse.json(productData, { status: 200 });

  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}
