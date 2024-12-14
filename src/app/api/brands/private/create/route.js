// src/app/api/brands/private/create/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../libs/firebaseAdmin';
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
const ensureUniqueSlug = async (slug) => {
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existingBrand = await firestore
      .collection('brands')
      .where('url', '==', uniqueSlug)
      .get();

    if (existingBrand.empty) {
      break; // El slug es único
    }

    uniqueSlug = `${slug}-${counter}`;
    counter += 1;
  }

  return uniqueSlug;
};

export async function POST(request) {
  try {
    // Obtener las cookies de la solicitud y esperar
    const cookieStore = await cookies(); // Añadir 'await' aquí
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

    // Obtener los datos de la marca
    const { name, description, categoryID } = await request.json();

    if (!name) {
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

    // Genera el slug para la URL
    let url = generateSlug(name);

    // Asegura la unicidad del slug
    url = await ensureUniqueSlug(url);

    // Crear una referencia a un nuevo documento en la colección 'brands'
    const brandDocRef = firestore.collection('brands').doc();

    const brandData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      url, // Añade el slug generado
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
      uniqueID: brandDocRef.id, // Establecer el uniqueID
      ownerId: uid, // Usar el ownerId obtenido del token
      categoryID, // ID de la categoría asociada
    };

    await brandDocRef.set(brandData); // Guardar la marca en Firestore

    return NextResponse.json({ message: 'Marca creada exitosamente.', uniqueID: brandDocRef.id, url }, { status: 201 });

  } catch (error) {
    console.error('Error al crear la marca:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
