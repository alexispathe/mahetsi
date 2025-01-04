// src/app/api/categories/private/create/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

// Función para generar slug
const generateSlug = (text) => {
  return text
    .toString()
    .normalize('NFD')                   // Normaliza la cadena para separar acentos
    .replace(/[\u0300-\u036f]/g, '')    // Elimina los acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Función para asegurar la unicidad del slug
const ensureUniqueSlug = async (slug) => {
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existingCategory = await firestore
      .collection('categories')
      .where('url', '==', uniqueSlug)
      .get();

    if (existingCategory.empty) {
      break; // El slug es único
    }

    uniqueSlug = `${slug}-${counter}`;
    counter += 1;
  }

  return uniqueSlug;
};

// Función para validar URLs
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export async function POST(request) {
  try {
    // Obtener las cookies de la solicitud de manera síncrona
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener el documento del usuario
    const userDoc = await getUserDocument(uid);
    const rolID = userDoc.rolID;

    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
    }

    // Obtener los permisos del rol
    const permissions = await getRolePermissions(rolID);

    // Verificar si el usuario tiene el permiso 'create'
    if (!permissions.includes('create')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "create".' }, { status: 403 });
    }

    // Obtener los datos de la categoría
    const { name, description, image } = await request.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ message: 'Nombre de la categoría obligatorio.' }, { status: 400 });
    }

    // Validar la URL de la imagen si se proporciona
    if (image && !isValidUrl(image)) {
      return NextResponse.json({ message: 'URL de la imagen no válida.' }, { status: 400 });
    }

    // Generar slug
    let url = generateSlug(name);

    // Asegurar unicidad del slug
    url = await ensureUniqueSlug(url);

    // Crear una referencia a un nuevo documento en 'categories'
    const categoryDocRef = firestore.collection('categories').doc();

    const categoryData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      url, // Añade el slug generado
      image: image ? image.trim() : '', // Añade la URL de la imagen si se proporciona
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
      uniqueID: categoryDocRef.id, // Establecer uniqueID
      ownerId: uid, // Asignar ownerId
    };

    await categoryDocRef.set(categoryData); // Guardar categoría en Firestore

    return NextResponse.json({ message: 'Categoría creada exitosamente.', uniqueID: categoryDocRef.id, url }, { status: 201 });

  } catch (error) {
    console.error('Error al crear la categoría:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
