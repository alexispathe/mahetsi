// src/app/api/sessionCheck/route.js
//Verifica si el usuario esta autenticado
import { NextResponse } from 'next/server';
import { authAdmin } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';
export async function GET() {
  const cookieStore =  await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ sessionActive: false }, { status: 200 });
  }

  try {
    const decodedClaims = await authAdmin.verifySessionCookie(session, true);
    if (decodedClaims) {
      return NextResponse.json({ sessionActive: true }, { status: 200 });
    }
  } catch (error) {
    console.error('Error verificando cookie:', error.message);
  }

  return NextResponse.json({ sessionActive: false }, { status: 200 });
}
