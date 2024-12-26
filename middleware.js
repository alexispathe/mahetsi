// src/middleware.js

import { authMiddleware } from 'next-firebase-auth-edge';

export async function middleware(request) {
  // Configura el middleware para proteger las rutas especificadas
  console.log("Entro al middleware")
  return authMiddleware(request, {
    loginPath: '/api/sessionLogin', // Ruta correcta de login
    logoutPath: '/api/sessionLogout', // Ruta correcta de logout
    apiKey: process.env.FIREBASE_API_KEY,
    cookieName: 'session', // Nombre de la cookie para la sesión
    cookieSignatureKeys: [process.env.COOKIE_SIGNATURE_KEY], // Claves para firmar la cookie
    cookieSerializeOptions: {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción la cookie será segura
      sameSite: 'strict',
      maxAge: 5 * 60, // 1 minuto en segundos
    },
    serviceAccount: {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    },
  });
}

// Definición del "matcher", para que el middleware solo se aplique a las rutas de la API protegidas
export const config = {
  matcher: [
    '/api/brands/private/:path*',
    '/api/cart/:path*',
    '/api/categories/private/:path*',
    '/api/favorites/:path*',
    '/api/products/private/:path*',
    '/api/roles/:path*',
    '/api/sessionLogout',
    '/api/types/private/:path*',
    '/api/verify-session',
  ],
};
