// src/app/api/orders/admin/get/route.js
//Devuelve las ordenes de los usuarios pero para el administrador
import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    
    if (!decodedToken) {
      throw new Error('Token decodificado es nulo');
    }

    const uid = decodedToken.uid;

    // Obtener el documento del usuario
    const userData = await getUserDocument(uid);
    
    if (!userData) {
      throw new Error('Datos de usuario no encontrados');
    }

    const rolID = userData.rolID;

    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado' }, { status: 403 });
    }

    // Obtener los permisos del rol
    const permissions = await getRolePermissions(rolID);

    // Verificar si el usuario tiene el permiso 'admin'
    if (!permissions.includes('admin')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "admin".' }, { status: 403 });
    }

    // Obtener todas las órdenes pendientes y enviadas
    const ordersSnapshot = await firestore.collection('orders')
      .where('orderStatus', 'in', ['pendiente', 'enviado'])
      .orderBy('dateCreated', 'desc')
      .get();
    

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateCreated: doc.data().dateCreated?.toDate() || null,
    }));
    

    return NextResponse.json({ message: 'Órdenes obtenidas exitosamente.', orders }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener las órdenes de admin:', error);
    let errorMessage = 'Error interno del servidor';
    
    // Manejar errores específicos de Firestore
    if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
      errorMessage = 'Índice requerido no encontrado. Por favor, crea el índice necesario en Firestore.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: 'Error interno del servidor', error: errorMessage }, { status: 500 });
  }
}
