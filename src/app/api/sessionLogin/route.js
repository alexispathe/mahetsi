// src/app/api/sessionLogin/route.js

import { NextResponse } from 'next/server';
import { authAdmin } from '@/libs/firebaseAdmin';

export async function POST(request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'No ID token provided' }, { status: 400 });
    }

    const expiresIn = 24 * 60 * 60 * 1000; // 1 día en ms
    const expiresInSeconds = expiresIn / 1000;
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn: expiresInSeconds });

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción la cookie será segura
      path: '/',
      maxAge: 60 * 60 * 24, // 1 día en seg
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error setting session cookie:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
