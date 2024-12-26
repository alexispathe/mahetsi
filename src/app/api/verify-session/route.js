import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions } from '../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      // Si no hay cookie, responde con 401 y elimina cualquier cookie residual
      const response = NextResponse.json({ message: 'No autenticado' }, { status: 401 });
      response.cookies.set('session', '', { path: '/', expires: new Date(0) }); // Elimina la cookie
      return response;
    }

    try {
      // Verificar la session cookie
      const decodedToken = await verifySessionCookie(sessionCookie);
      const uid = decodedToken.uid;

      // Obtener el documento del usuario
      const userData = await getUserDocument(uid);
      const rolID = userData.rolID;

      if (!rolID) {
        // Si no hay rol asignado, elimina la cookie y responde con 403
        const response = NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
        response.cookies.set('session', '', { path: '/', expires: new Date(0) }); // Elimina la cookie
        return response;
      }

      // Obtener los permisos del rol
      const permissions = await getRolePermissions(rolID);

      return NextResponse.json({ 
        message: 'Autenticado', 
        user: {
          uid,
          email: userData.email,
          name: userData.name,
          rolID,
          permissions,
        } 
      }, { status: 200 });
    } catch (verificationError) {
      // Si la cookie es inválida o expirada, responde con 401 y elimina la cookie
      console.error('Error al verificar la cookie:', verificationError);
      const response = NextResponse.json({ message: 'Cookie inválida o expirada' }, { status: 401 });
      response.cookies.set('session', '', { path: '/', expires: new Date(0) }); // Elimina la cookie
      return response;
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}
