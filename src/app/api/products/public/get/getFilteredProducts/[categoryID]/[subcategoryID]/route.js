// src/app/api/products/public/get/getFilteredProducts/[categoryID]/[subcategoryID]/route.js

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../../libs/firebaseAdmin';

export async function GET(request, context) {
  try {
    const { params } = context;
    const { categoryID, subcategoryID } = await params; // Obtener ambos IDs de la URL
    console.log("ids para el proyecto", categoryID, subcategoryID)

    // Construir la consulta base
    let query = firestore.collection('products');

    // Filtrar por categoryID si se proporciona
    if (categoryID) {
      query = query.where('categoryID', '==', categoryID);
    }

    // Filtrar por subcategoryID si se proporciona
    if (subcategoryID) {
      query = query.where('subcategoryID', '==', subcategoryID);
    }

    const productsSnapshot = await query.get();

    const products = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uniqueID: doc.id,
        name: data.name,
        price: data.price,
        categoryID: data.categoryID,
        brandID: data.brandID,
        typeID: data.typeID,
        size: data.size,
        images: data.images || [],
        url: data.url || '',
        subcategoryID: data.subcategoryID
      };
    });

    return NextResponse.json(
      { products },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
