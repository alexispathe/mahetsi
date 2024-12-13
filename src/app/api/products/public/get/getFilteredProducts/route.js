// src/app/api/products/public/get/getFilteredProducts/route.js

import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Asegúrate de que la ruta es correcta

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parámetros de filtrado
    const categoryIDs = searchParams.getAll('categoryID'); // Acepta múltiples categorías
    const brandNames = searchParams.getAll('brand');       // Acepta múltiples marcas
    const typeNames = searchParams.getAll('type');         // Acepta múltiples tipos
    const sizes = searchParams.getAll('size');             // Acepta múltiples tallas
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 1000;

    // Construir una consulta en Firestore
    let query = firestore.collection('products').where('price', '>=', minPrice).where('price', '<=', maxPrice);

    // Filtro por categoría
    if (categoryIDs.length > 0) {
      // Firestore permite hasta 10 elementos en 'in' queries
      query = query.where('categoryID', 'in', categoryIDs.slice(0, 10));
    }

    // Filtro por marcas
    if (brandNames.length > 0) {
      const brandDocs = await firestore.collection('brands').where('name', 'in', brandNames.slice(0, 10)).get();
      const brandIDs = brandDocs.docs.map(doc => doc.id);
      if (brandIDs.length > 0) {
        query = query.where('brandID', 'in', brandIDs.slice(0, 10));
      }
    }

    // Filtro por tipos
    if (typeNames.length > 0) {
      const typeDocs = await firestore.collection('types').where('name', 'in', typeNames.slice(0, 10)).get();
      const typeIDs = typeDocs.docs.map(doc => doc.id);
      if (typeIDs.length > 0) {
        query = query.where('typeID', 'in', typeIDs.slice(0, 10));
      }
    }

    // Filtro por tallas
    if (sizes.length > 0) {
      query = query.where('size', 'in', sizes.slice(0, 10));
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
      };
    });

    return NextResponse.json(
      { products },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener los productos filtrados:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
