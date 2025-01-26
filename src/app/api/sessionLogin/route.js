// src/app/api/sessionLogin/route.js
import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import { z } from 'zod';
import admin from 'firebase-admin';

// Definir el esquema de validación
const sessionLoginSchema = z.object({
  idToken: z.string(),
});

export async function POST(request) {
  try {
    // Validar y extraer datos del cuerpo de la solicitud
    const body = await request.json();
    const parsedBody = sessionLoginSchema.safeParse(body);
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

    // Verificar el ID token
    const decodedIdToken = await authAdmin.verifyIdToken(idToken);
    if (!decodedIdToken) {
      return NextResponse.json(
        { error: 'Token de autenticación inválido' },
        { status: 401 }
      );
    }

    const uid = decodedIdToken.uid;

    // Crear la sesión de usuario con una expiración de 7 días
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 días en milisegundos
    const sessionCookie = await authAdmin.createSessionCookie(idToken, {
      expiresIn,
    });

    if (!sessionCookie) {
      throw new Error('Failed to create session cookie');
    }

    const { email, name, picture } = decodedIdToken;
    // Actualizar o crear documento de usuario
    const userRef = firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    if (!userDoc.exists) {
      await userRef.set({
        name: name || '',
        email: email || '',
        picture: picture || '',
        dateCreated: timestamp,
        dateModified: timestamp,
        rolID: 'gB4kyZZNT8HLbsyTBRGi',
        ownerId: uid,
      });
    } else {
      await userRef.update({
        dateModified: timestamp,
      });
    }

    // Crear y configurar la respuesta sin incluir el sessionCookie en el cuerpo
    const response = NextResponse.json({
      status: 'success',
      uid: uid,
    });

    // Configurar la cookie de sesión con una expiración de 7 días
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
    });

    return response;
  } catch (error) {
    console.error('Error en sessionLogin:', error);

    // Manejo específico de errores
    if (error.code === 'auth/invalid-id-token') {
      return NextResponse.json(
        { error: 'Token de autenticación inválido' },
        { status: 401 }
      );
    }

    if (error.code === 'auth/session-cookie-expired') {
      return NextResponse.json(
        { error: 'La sesión ha expirado' },
        { status: 401 }
      );
    }

    // Manejo de validaciones de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos de entrada inválidos',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Error general
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
