// src/app/api/sessionLogout/route.js
import { cookies } from 'next/headers';
import { authAdmin } from '@/libs/firebaseAdmin';

export async function POST(request) {
  try {
    const { idToken } = await request.json();
    if (idToken) {
      await authAdmin.revokeRefreshTokens(idToken);
    }
    cookies().delete('session');
    return new Response(JSON.stringify({ status: 'logged out' }), { status: 200 });
  } catch (error) {
    console.error('Error during logout:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
