// src/app/api/sessionLogout/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authAdmin } from '@/libs/firebaseAdmin';

export async function POST(request) {
  try {
    // Obtener las cookies de la solicitud
    const cookieStore = cookies();
    const session = cookieStore.get('session')?.value;

    if (session) {
      // Verificar la cookie de sesión
      const decodedClaims = await authAdmin.verifySessionCookie(session, true);
      const uid = decodedClaims.uid;

      // Revocar los tokens de actualización del usuario
      await authAdmin.revokeRefreshTokens(uid);
    }

    // Crear una respuesta y eliminar la cookie de sesión
    const response = NextResponse.json({ status: 'logged out' });
    response.cookies.delete('session');

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
