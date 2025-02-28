// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  // Extrae la cookie 'session'
  const sessionCookie = req.cookies.get('session');
  const { pathname } = req.nextUrl;

  // Si el usuario ya tiene la cookie y accede a /login, redirige a la página principal (u otra ruta)
  if (pathname === '/login' && sessionCookie) {
    return NextResponse.redirect(new URL('/profile/user', req.url));
  }

  // Rutas protegidas: /profile/* y /checkout
  const protectedPaths = ['/profile', '/checkout'];

  // Si la ruta solicitada es protegida y no hay cookie, redirige a login
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!sessionCookie) {
      const loginUrl = new URL('/login', req.url);
      // Agrega la URL actual para redirigir de vuelta después del login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si todo está correcto, continúa con la petición
  return NextResponse.next();
}

// Define para qué rutas se ejecuta el middleware
export const config = {
  matcher: ['/profile/:path*', '/checkout', '/login'],
};
