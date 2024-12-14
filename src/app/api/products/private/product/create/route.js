// src/app/api/products/private/product/create/route.js

import { NextResponse } from 'next/server';
import { firestore, verifySessionCookie } from '../../../../../../libs/firebaseAdmin';
import admin from 'firebase-admin';
import slugify from 'slugify';

// Función para generar el slug
const generateSlug = (text) => {
  return slugify(text, {
    lower: true,      // Convierte a minúsculas
    strict: true,     // Elimina caracteres especiales
    locale: 'es',     // Maneja caracteres específicos del idioma español
  });
};

// Función para asegurar la unicidad del slug
const ensureUniqueSlug = async (slug) => {
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existingProduct = await firestore
      .collection('products')
      .where('url', '==', uniqueSlug)
      .get();

    if (existingProduct.empty) {
      break; // El slug es único
    }

    uniqueSlug = `${slug}-${counter}`;
    counter += 1;
  }

  return uniqueSlug;
};

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const decodedToken = await verifySessionCookie(sessionCookie);
    const ownerId = decodedToken.uid; // El ID del usuario actual

    const { name, description, price, stockQuantity, categoryID, subcategoryID, brandID, typeID, images } = await request.json();

    // Validaciones básicas
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ message: 'Nombre del producto es obligatorio y debe ser una cadena de texto.' }, { status: 400 });
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ message: 'Precio es obligatorio y debe ser un número positivo.' }, { status: 400 });
    }

    if (stockQuantity === undefined || typeof stockQuantity !== 'number' || stockQuantity < 0) {
      return NextResponse.json({ message: 'Cantidad de stock es obligatoria y debe ser un número no negativo.' }, { status: 400 });
    }

    if (!categoryID || typeof categoryID !== 'string') {
      return NextResponse.json({ message: 'ID de categoría es obligatorio y debe ser una cadena de texto.' }, { status: 400 });
    }

    if (!subcategoryID || typeof subcategoryID !== 'string') {
      return NextResponse.json({ message: 'ID de subcategoría es obligatorio y debe ser una cadena de texto.' }, { status: 400 });
    }

    if (!brandID || typeof brandID !== 'string') {
      return NextResponse.json({ message: 'ID de marca es obligatorio y debe ser una cadena de texto.' }, { status: 400 });
    }

    if (!typeID || typeof typeID !== 'string') {
      return NextResponse.json({ message: 'ID de tipo es obligatorio y debe ser una cadena de texto.' }, { status: 400 });
    }

    if (!Array.isArray(images)) {
      return NextResponse.json({ message: 'Las imágenes deben ser un arreglo de URLs.' }, { status: 400 });
    }

    // Verifica que la categoría exista
    const categoryDoc = await firestore.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    // Verifica que la subcategoría exista y pertenezca a la categoría
    const subcategoryDoc = await firestore
      .collection('categories')
      .doc(categoryID)
      .collection('subCategories')
      .doc(subcategoryID)
      .get();

    if (!subcategoryDoc.exists) {
      return NextResponse.json({ message: 'Subcategoría no encontrada.' }, { status: 404 });
    }

    if (subcategoryDoc.data().categoryID !== categoryID) {
      return NextResponse.json({ message: 'Subcategoría no pertenece a la categoría seleccionada.' }, { status: 400 });
    }

    // Verifica que la marca exista y pertenezca a la categoría
    const brandDoc = await firestore.collection('brands').doc(brandID).get();
    if (!brandDoc.exists) {
      return NextResponse.json({ message: 'Marca no encontrada.' }, { status: 404 });
    }

    if (brandDoc.data().categoryID !== categoryID) {
      return NextResponse.json({ message: 'Marca no pertenece a la categoría seleccionada.' }, { status: 400 });
    }

    // Verifica que el tipo exista y pertenezca a la categoría
    const typeDoc = await firestore.collection('types').doc(typeID).get();
    if (!typeDoc.exists) {
      return NextResponse.json({ message: 'Tipo no encontrado.' }, { status: 404 });
    }

    if (typeDoc.data().categoryID !== categoryID) {
      return NextResponse.json({ message: 'Tipo no pertenece a la categoría seleccionada.' }, { status: 400 });
    }

    // Genera el slug para la URL
    let url = generateSlug(name);

    // Asegura la unicidad del slug
    url = await ensureUniqueSlug(url);

    // Crear una referencia a un nuevo documento en la colección 'products'
    const productDocRef = firestore.collection('products').doc();

    const productData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      price,
      stockQuantity,
      categoryID: categoryID.trim(),
      subcategoryID: subcategoryID.trim(),
      brandID: brandID.trim(),
      typeID: typeID.trim(),
      images: images.map((img) => img.trim()),
      averageRating: 0, // Inicialmente 0
      numReviews: 0,     // Inicialmente 0
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
      uniqueID: productDocRef.id, // Establecer el uniqueID
      ownerId, // Usar el ownerId obtenido del token
      url, // Añade el slug generado
    };

    await productDocRef.set(productData); // Guardar el producto en Firestore

    return NextResponse.json({ message: 'Producto creado exitosamente.', uniqueID: productDocRef.id, url }, { status: 201 });

  } catch (error) {
    console.error('Error al crear el producto:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
