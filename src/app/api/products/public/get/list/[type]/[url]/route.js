// src/app/api/products/public/list/[type]/[url]/route.js
//Devuelve todos los productos para la categoria
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../../libs/firebaseAdmin';

export async function GET(request, { params }) {
  const { type, url } = params;
  // Obtener los parámetros de consulta
  const { searchParams } = new URL(request.url);
  const brandIDs = searchParams.get('brandIDs'); // Comma-separated
  const typeIDs = searchParams.get('typeIDs');   // Comma-separated
  const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
  const maxPrice = parseFloat(searchParams.get('maxPrice')) || Number.MAX_SAFE_INTEGER;
  const sizes = searchParams.get('sizes');         // Comma-separated
  console.log("Este es el brand ",brandIDs)
  try {
    // 1. Validar los parámetros
    if (!type || !url) {
      return NextResponse.json(
        { message: 'Parámetros inválidos.' },
        { status: 400 }
      );
    }

    if (type !== 'category' && type !== 'subcategory') {
      return NextResponse.json(
        { message: 'Tipo inválido. Debe ser "category" o "subcategory".' },
        { status: 400 }
      );
    }

    // 2. Buscar el ID basado en el url
    let referenceId = null;

    if (type === 'category') {
      const categorySnapshot = await firestore.collection('categories').where('url', '==', url).limit(1).get();
      if (categorySnapshot.empty) {
        return NextResponse.json(
          { message: 'Categoría no encontrada.' },
          { status: 404 }
        );
      }
      referenceId = categorySnapshot.docs[0].id; // Utilizamos el ID del documento
    } else if (type === 'subcategory') {
      // Asumiendo que los URLs de subcategorías son únicos globalmente
      const categoriesSnapshot = await firestore.collection('categories').get();
      let found = false;

      for (const categoryDoc of categoriesSnapshot.docs) {
        const subcategoriesSnapshot = await categoryDoc.ref.collection('subCategories').where('url', '==', url).limit(1).get();
        if (!subcategoriesSnapshot.empty) {
          referenceId = subcategoriesSnapshot.docs[0].id; // Utilizamos el ID del documento
          found = true;
          break;
        }
      }

      if (!found) {
        return NextResponse.json(
          { message: 'Subcategoría no encontrada.' },
          { status: 404 }
        );
      }
    }

    // 3. Construir la consulta para productos
    let query = firestore.collection('products');

    if (type === 'category') {
      query = query.where('categoryID', '==', referenceId);
    } else if (type === 'subcategory') {
      query = query.where('subcategoryID', '==', referenceId);
    }

    // Aplicar filtros adicionales
    if (brandIDs) {
      const brandIDArray = brandIDs.split(',');
      query = query.where('brandID', 'in', brandIDArray);
    }

    if (typeIDs) {
      const typeIDArray = typeIDs.split(',');
      query = query.where('typeID', 'in', typeIDArray);
    }

    if (minPrice || maxPrice !== Number.MAX_SAFE_INTEGER) {
      query = query.where('price', '>=', minPrice).where('price', '<=', maxPrice);
    }

    if (sizes) {
      const sizeArray = sizes.split(',');
      query = query.where('size', 'in', sizeArray);
    }

    // 4. Ejecutar la consulta
    const productsSnapshot = await query.get();

    if (productsSnapshot.empty) {
      return NextResponse.json(
        { message: 'No se encontraron productos.' },
        { status: 404 }
      );
    }

    // 5. Mapear los productos con solo los campos necesarios
    const products = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uniqueID: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        stockQuantity: data.stockQuantity,
        total_sales: data.total_sales,
        categoryID: data.categoryID,
        subcategoryID: data.subcategoryID,
        brandID: data.brandID,
        typeID: data.typeID,
        size: data.size, // Asegúrate de que el campo 'size' existe en tus documentos
        images: data.images,
        averageRating: data.averageRating,
        numReviews: data.numReviews,
        url: data.url,
        dateCreated: data.dateCreated,
        dateModified: data.dateModified,
        ownerId: data.ownerId,
      };
    });

    // 6. Devolver la respuesta
    return NextResponse.json(
      { products },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}
