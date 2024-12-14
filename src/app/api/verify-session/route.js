// src/app/api/verify-session/route.js
import { NextResponse } from 'next/server';
import { verifyIdToken } from '../../../libs/firebaseAdmin'; // Asegúrate de tener esta función configurada

export async function GET(request) {
  try {
    const cookies = request.cookies; // Obtenemos las cookies
    const sessionToken = cookies.get('session'); // Obtener el token de sesión

    if (!sessionToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Verificar el token
    const decodedToken = await verifyIdToken(sessionToken);

    return NextResponse.json({ message: 'Autenticado', user: decodedToken });

  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}
