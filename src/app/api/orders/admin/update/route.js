// src/app/api/orders/admin/update/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserDocument, getRolePermissions, firestore } from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin'
export async function POST(request) {
  try {
    // Obtener el cuerpo de la solicitud
    const { orderId, trackingNumber, courier } = await request.json();

    // Validar los datos recibidos
    if (!orderId || !trackingNumber || !courier) {
      return NextResponse.json(
        { message: 'Datos incompletos. Se requieren orderId, trackingNumber y courier.' },
        { status: 400 }
      );
    }

    // Obtener las cookies de la solicitud
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);

    if (!decodedToken) {
      return NextResponse.json({ message: 'Token de sesión inválido.' }, { status: 401 });
    }

    const uid = decodedToken.uid;

    // Obtener los datos del usuario
    const userData = await getUserDocument(uid);

    if (!userData) {
      return NextResponse.json({ message: 'Datos de usuario no encontrados.' }, { status: 404 });
    }

    const rolID = userData.rolID;

    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado.' }, { status: 403 });
    }

    // Obtener los permisos del rol
    const permissions = await getRolePermissions(rolID);

    // Verificar si el usuario tiene el permiso 'admin'
    if (!permissions.includes('admin')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "admin".' }, { status: 403 });
    }

    // Referencia a la orden en Firestore
    const orderRef = firestore.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ message: 'Orden no encontrada.' }, { status: 404 });
    }

    const orderData = orderDoc.data();

    // Verificar que la orden esté en estado 'pendiente' antes de actualizar
    if (orderData.orderStatus !== 'pendiente') {
      return NextResponse.json(
        { message: 'Solo se pueden actualizar órdenes en estado "pendiente".' },
        { status: 400 }
      );
    }

    // Actualizar la orden en Firestore
    await orderRef.update({
      orderStatus: 'enviado',
      trackingNumber,
      courier,
      dateShipped: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Obtener la orden actualizada
    const updatedOrderDoc = await orderRef.get();
    const updatedOrder = updatedOrderDoc.data();

    return NextResponse.json(
      { message: 'Orden actualizada exitosamente.', order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    let errorMessage = 'Error interno del servidor.';

    // Manejar errores específicos de Firestore relacionados con índices
    if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
      errorMessage = 'Índice requerido no encontrado. Por favor, crea el índice necesario en Firestore.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: 'Error interno del servidor.', error: errorMessage },
      { status: 500 }
    );
  }
}
