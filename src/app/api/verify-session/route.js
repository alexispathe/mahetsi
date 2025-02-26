// src/app/api/verify-session/route.js
import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions } from '../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies(); // Obtener el gestor de cookies
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      // Si no hay cookie, responde con 401 y elimina cualquier cookie residual
      cookieStore.delete('session'); // Elimina la cookie directamente
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    try {
      // Verificar la session cookie
      const decodedToken = await verifySessionCookie(sessionCookie);
      const uid = decodedToken.uid;

      // Obtener el documento del usuario
      const userData = await getUserDocument(uid);
      const rolID = userData.rolID;

      if (!rolID) {
        // Si no hay rol asignado, elimina la cookie y responde con 403
        cookieStore.delete('session'); // Elimina la cookie directamente
        return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
      }

      // Obtener los permisos del rol
      const permissions = await getRolePermissions(rolID);

      return NextResponse.json({
        message: 'Autenticado',
        user: {
          uid,
          picture: userData.picture,
          email: userData.email,
          name: userData.name,
          rolID,
          permissions,

        },
        exp: decodedToken.exp  // Se envía la fecha de expiración (en segundos).
      }, { status: 200 });
    } catch (verificationError) {
      // Si la cookie es inválida o expirada, responde con 401 y elimina la cookie
      console.error('Error al verificar la cookie:', verificationError);
      cookieStore.delete('session'); // Elimina la cookie directamente
      return NextResponse.json({ message: 'Cookie inválida o expirada' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}
