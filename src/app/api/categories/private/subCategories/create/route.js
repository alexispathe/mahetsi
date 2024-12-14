// src/app/api/categories/private/subCategories/create/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

// Función personalizada para generar el slug
const generateSlug = (text) => {
  return text
    .toString()
    .normalize('NFD')                   // Normaliza la cadena para separar acentos
    .replace(/[\u0300-\u036f]/g, '')    // Elimina los acentos
    .toLowerCase()                      // Convierte a minúsculas
    .trim()                             // Elimina espacios al inicio y al final
    .replace(/\s+/g, '-')               // Reemplaza espacios por guiones
    .replace(/[^\w\-]+/g, '')           // Elimina caracteres especiales
    .replace(/\-\-+/g, '-');            // Reemplaza múltiples guiones por uno solo
};

// Función para asegurar la unicidad del slug
const ensureUniqueSlug = async (slug, categoryID) => {
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existingSubcategory = await firestore
      .collection('categories')
      .doc(categoryID)
      .collection('subCategories')
      .where('url', '==', uniqueSlug)
      .get();

    if (existingSubcategory.empty) {
      break; // El slug es único
    }

    uniqueSlug = `${slug}-${counter}`;
    counter += 1;
  }

  return uniqueSlug;
};

export async function POST(request) {
  try {
    // Obtener las cookies de la solicitud
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener el documento del usuario
    const userData = await getUserDocument(uid);
    const rolID = userData.rolID;

    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
    }

    // Obtener los permisos del rol
    const permissions = await getRolePermissions(rolID);

    // Verificar si el usuario tiene el permiso 'create'
    if (!permissions.includes('create')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "create".' }, { status: 403 });
    }

    // Obtener los datos de la subcategoría
    const { name, description, categoryID } = await request.json();

    // Validaciones básicas
    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'Nombre de la subcategoría obligatorio.' }, { status: 400 });
    }

    if (!categoryID) {
      return NextResponse.json({ message: 'ID de la categoría es obligatorio.' }, { status: 400 });
    }

    // Verificar que la categoría exista
    const categoryDoc = await firestore.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    // Generar URL única
    const slug = generateSlug(name);
    const url = await ensureUniqueSlug(slug, categoryID);

    // Crear referencia al nuevo documento en la subcolección 'subCategories'
    const subcategoryDocRef = firestore.collection('categories').doc(categoryID).collection('subCategories').doc();

    const subcategoryData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
      subCategoryID: subcategoryDocRef.id,
      ownerId: uid,
      categoryID,
      url,
    };
    console.log(subcategoryData);
    await subcategoryDocRef.set(subcategoryData);

    return NextResponse.json({ message: 'Subcategoría creada exitosamente.', subCategoryID: subcategoryDocRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error al crear la subcategoría:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
