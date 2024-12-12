// src/app/api/products/public/search/route.js
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../libs/firebaseAdmin'; // Ajusta la ruta a tu configuración

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = (searchParams.get('search') || '').toLowerCase().trim();

    if (!searchQuery) {
      return NextResponse.json(
        { message: 'No se proporcionó un término de búsqueda.' },
        { status: 400 }
      );
    }

    // Obtener todos los productos
    const productsSnapshot = await firestore.collection('products').get();

    if (productsSnapshot.empty) {
      return NextResponse.json(
        { products: [] },
        { status: 200 }
      );
    }

    const productsData = productsSnapshot.docs.map(doc => ({
      uniqueID: doc.id,
      ...doc.data()
    }));

    // Para matchear por categoría y subcategoría:
    // Obtenemos TODAS las categorías y subcategorías para poder matchear por nombre
    const categoriesSnapshot = await firestore.collection('categories').get();
    const categories = [];
    const subcategories = [];

    for (const catDoc of categoriesSnapshot.docs) {
      const catData = catDoc.data();
      categories.push({ id: catDoc.id, name: catData.name, url: catData.url });

      const subcatsSnapshot = await catDoc.ref.collection('subCategories').get();
      subcatsSnapshot.forEach(subDoc => {
        const subData = subDoc.data();
        subcategories.push({ id: subDoc.id, name: subData.name, url: subData.url, categoryID: catDoc.id });
      });
    }

    // Filtrar los productos que coincidan con el searchQuery
    const filtered = productsData.filter((product) => {
      const productName = product.name?.toLowerCase() || '';
      const productDesc = product.description?.toLowerCase() || '';

      const categoryName = (categories.find(cat => cat.id === product.categoryID)?.name || '').toLowerCase();
      const subcategoryName = (subcategories.find(sub => sub.id === product.subcategoryID)?.name || '').toLowerCase();

      return (
        productName.includes(searchQuery) ||
        productDesc.includes(searchQuery) ||
        categoryName.includes(searchQuery) ||
        subcategoryName.includes(searchQuery)
      );
    });

    return NextResponse.json(
      { products: filtered },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al buscar productos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}
