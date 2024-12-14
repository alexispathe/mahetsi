// src/app/api/categories/private/subCategories/update/[categoryID]/[subCategoryID]/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../../../libs/firebaseAdmin';
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
const ensureUniqueSlug = async (slug, categoryID, subCategoryID) => {
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existingSubcategory = await firestore
      .collection('categories')
      .doc(categoryID)
      .collection('subCategories')
      .where('url', '==', uniqueSlug)
      .where('subCategoryID', '!=', subCategoryID)
      .get();

    if (existingSubcategory.empty) {
      break; // El slug es único
    }

    uniqueSlug = `${slug}-${counter}`;
    counter += 1;
  }

  return uniqueSlug;
};

export async function PUT(request, { params }) { // Función asíncrona y desestructuración correcta
  const { categoryID, subCategoryID } = params;

  try {
    // Obtener las cookies de la solicitud
    const cookieStore = await cookies(); // Usa await si Next.js lo requiere
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener el documento del usuario
    const userData = await getUserDocument(uid);
    const rolID = userData?.rolID;

    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
    }

    // Obtener los permisos del rol
    const permissions = await getRolePermissions(rolID);

    // Verificar si el usuario tiene el permiso 'update'
    if (!permissions.includes('update')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "update".' }, { status: 403 });
    }

    // Obtener los datos de la subcategoría desde el cuerpo de la solicitud
    const body = await request.json();

    // Validaciones básicas
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Cuerpo de la solicitud inválido.' }, { status: 400 });
    }

    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'Nombre de la subcategoría obligatorio.' }, { status: 400 });
    }

    // Verificar que la categoría exista
    const categoryDoc = await firestore.collection('categories').doc(categoryID).get();
    if (!categoryDoc.exists) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    // Buscar la subcategoría por subCategoryID en la categoría especificada
    const subcategoryDocRef = firestore.collection('categories').doc(categoryID).collection('subCategories').doc(subCategoryID);
    const subcategoryDoc = await subcategoryDocRef.get();

    if (!subcategoryDoc.exists) {
      return NextResponse.json({ message: 'Subcategoría no encontrada.' }, { status: 404 });
    }

    // (Opcional) Generar URL única si el nombre ha cambiado
    let url = subcategoryDoc.data().url;
    if (name.trim().toLowerCase() !== subcategoryDoc.data().name.toLowerCase()) {
      const slug = generateSlug(name);
      url = await ensureUniqueSlug(slug, categoryID, subCategoryID);
    }

    // Datos actualizados de la subcategoría
    const updatedSubcategoryData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
      url,
    };

    // Actualizar la subcategoría en Firestore
    await subcategoryDocRef.update(updatedSubcategoryData);

    return NextResponse.json({ message: 'Subcategoría actualizada exitosamente.' }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar la subcategoría:', error);
    const errorMessage = error?.message || 'Unknown error';
    return NextResponse.json({ message: 'Error interno del servidor.', error: errorMessage }, { status: 500 });
  }
}
