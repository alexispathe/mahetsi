// middleware.js
import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.clone()

  // 1. Forzar HTTPS en todas las peticiones
  if (req.nextUrl.protocol === 'http:') {
    url.protocol = 'https:'
    return NextResponse.redirect(url)
  }

  const sessionCookie = req.cookies.get('session')?.value
  const { pathname } = req.nextUrl

  // 2. Si ya hay sesión y el usuario va a /login, redirigir a su perfil
  if (pathname === '/login' && sessionCookie) {
    return NextResponse.redirect(new URL('/profile/user', req.url))
  }

  // 3. Comprobar rutas protegidas
  const protectedPaths = ['/profile', '/checkout']
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!sessionCookie) {
      // Redirigir a login y guardar la ruta original
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 4. Si no hay redirección, continuar con la petición
  return NextResponse.next()
}

export const config = {
  // Ejecutar middleware en todas las rutas para forzar HTTPS y en las rutas de login/profile/checkout
  matcher: ['/:path*']
}
