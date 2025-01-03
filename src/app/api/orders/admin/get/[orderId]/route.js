// src/app/api/orders/admin/get/[orderId]/route.js
//Devuelve la informacion del n usuario de forma individual para el administrador
import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '../../../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET(request, context) {
 const params = await context.params;
  const { orderId } = params;

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
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso.' }, { status: 403 });
    }

    // Obtener la orden específica por ID
    const orderDoc = await firestore.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      return NextResponse.json({ message: 'Orden no encontrada' }, { status: 404 });
    }

    const orderData = orderDoc.data();

    const order = {
      id: orderDoc.id,
      ...orderData,
      dateCreated: orderData.dateCreated?.toDate() || null,
    };

    return NextResponse.json({ message: 'Orden obtenida exitosamente.', order }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener la orden específica de admin:', error);
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
