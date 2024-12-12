// src/app/api/sessionLogout/route.js
import { cookies } from 'next/headers';

export async function POST() {
  cookies().delete('session');
  return new Response(JSON.stringify({ status: 'logged out' }), { status: 200 });
}
