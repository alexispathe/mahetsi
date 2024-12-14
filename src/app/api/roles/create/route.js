// src/app/api/roles/create/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin'; // Asegúrate de tener esta importación

export async function POST(request) {
  try {
    // Esperar la obtención de las cookies de la solicitud
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

    // Obtener los datos del rol a crear
    const { name, permissions: rolePermissions, description } = await request.json();
    console.log("Datos recibidos:", { name, permissions: rolePermissions, description });

    // Validación básica del nombre
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ message: 'El nombre del rol es obligatorio.' }, { status: 400 });
    }

    // Manejar permissions de forma flexible
    const permissionsArray = Array.isArray(rolePermissions)
      ? rolePermissions.map(p => p.trim())
      : typeof rolePermissions === 'string'
      ? rolePermissions.split(',').map(p => p.trim())
      : [];

    // Crear una referencia a un nuevo documento en la colección 'roles'
    const roleDocRef = firestore.collection('roles').doc();

    const newRole = {
      name: name.trim(),
      permissions: permissionsArray,
      description: description ? description.trim() : '',
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      dateModified: admin.firestore.FieldValue.serverTimestamp(),
      rolID: roleDocRef.id, // Establecer el rolID con el ID del documento
    };

    // Guardar el rol en la referencia creada
    await roleDocRef.set(newRole);

    return NextResponse.json({ message: 'Rol creado exitosamente.', rolID: roleDocRef.id }, { status: 201 });

  } catch (error) {
    console.error('Error al crear el rol:', error);
    return NextResponse.json({ message: 'Error interno del servidor.', error: error.message }, { status: 500 });
  }
}
