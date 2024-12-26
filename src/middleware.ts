// middleware.js
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authAdmin } from '@/libs/firebaseAdmin';

export async function middleware(request: NextRequest) {
  const { cookies } = request;
  const sessionCookie = cookies.get('session')?.value;

  const url = request.nextUrl.clone();

  // Rutas que no requieren autenticación
  const publicPaths = ['/login', '/_next', '/favicon.ico'];

  // Si la ruta es pública, permitir el acceso
  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    // Si el usuario ya está autenticado y está intentando acceder a /login, redirigir al perfil
    if (url.pathname === '/login' && sessionCookie) {
      try {
        await authAdmin.verifySessionCookie(sessionCookie);
        return NextResponse.redirect(new URL('/profile/user', request.url));
      } catch (error) {
        // Si la cookie es inválida, permitir el acceso a /login
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Rutas protegidas
  const protectedPaths = ['/profile'];

  if (protectedPaths.some((path) => url.pathname.startsWith(path))) {
    if (!sessionCookie) {
      // Si no hay cookie de sesión, redirigir a /login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verificar la cookie de sesión
      await authAdmin.verifySessionCookie(sessionCookie);
      // Si es válida, permitir el acceso
      return NextResponse.next();
    } catch (error) {
      // Si la cookie es inválida o ha expirado, redirigir a /login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/profile/:path*'],
};
