// src/app/api/renew-session/route.js

import { NextResponse } from 'next/server';
import { authAdmin } from '@/libs/firebaseAdmin';
import { z } from 'zod';

const renewSessionSchema = z.object({
  idToken: z.string(),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedBody = renewSessionSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Datos de entrada inválidos',
          details: parsedBody.error.errors,
        },
        { status: 400 }
      );
    }

    const { idToken } = parsedBody.data;
    const decodedIdToken = await authAdmin.verifyIdToken(idToken);
    if (!decodedIdToken) {
      return NextResponse.json(
        { error: 'Token de autenticación inválido' },
        { status: 401 }
      );
    }

    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 días en milisegundos
    const newSessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });

    if (!newSessionCookie) {
      throw new Error('No se pudo crear la nueva cookie de sesión');
    }

    const response = NextResponse.json({
      status: 'success',
      uid: decodedIdToken.uid,
    });

    response.cookies.set('session', newSessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
    });

    return response;
  } catch (error) {
    console.error('Error en renewSession:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos de entrada inválidos',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
