// src/app/api/orders/admin/update/route.js
import { NextResponse } from 'next/server';
import {
  verifySessionCookie,
  getUserDocument,
  getRolePermissions,
  firestore
} from '@/libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

export async function POST(request) {
  try {
    const { orderId, trackingNumber, courier, newStatus } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { message: 'Falta el orderId.' },
        { status: 400 }
      );
    }

    // Session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
    }

    // Verificar la cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    if (!decodedToken) {
      return NextResponse.json({ message: 'Token de sesión inválido.' }, { status: 401 });
    }

    const uid = decodedToken.uid;

    // Verificar permisos
    const userData = await getUserDocument(uid);
    if (!userData) {
      return NextResponse.json({ message: 'Datos de usuario no encontrados.' }, { status: 404 });
    }

    const rolID = userData.rolID;
    if (!rolID) {
      return NextResponse.json({ message: 'Usuario sin rol asignado.' }, { status: 403 });
    }

    const permissions = await getRolePermissions(rolID);
    if (!permissions.includes('admin')) {
      return NextResponse.json({ message: 'Acción no permitida. Se requiere permiso "admin".' }, { status: 403 });
    }

    // Buscar la orden
    const orderRef = firestore.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ message: 'Orden no encontrada.' }, { status: 404 });
    }

    const orderData = orderDoc.data();

    // Construir campos a actualizar
    const updateFields = {};

    if (typeof trackingNumber === 'string') {
      updateFields.trackingNumber = trackingNumber;
    }
    if (typeof courier === 'string') {
      updateFields.courier = courier;
    }
    if (typeof newStatus === 'string') {
      updateFields.orderStatus = newStatus;

      // Guardamos fecha de envío si pasa a "enviado"
      if (newStatus === 'enviado' && orderData.orderStatus !== 'enviado') {
        updateFields.dateShipped = admin.firestore.FieldValue.serverTimestamp();
      }
      // Guardamos fecha de entrega si pasa a "entregado"
      if (newStatus === 'entregado' && orderData.orderStatus !== 'entregado') {
        updateFields.dateDelivered = admin.firestore.FieldValue.serverTimestamp();
      }
      // Podrías manejar una fecha de cancelación, etc., si quieres
    }

    // Actualizar Firestore
    await orderRef.update(updateFields);

    // Traer la orden actualizada
    const updatedOrderDoc = await orderRef.get();
    const updatedOrder = updatedOrderDoc.data();

    return NextResponse.json(
      { message: 'Orden actualizada exitosamente.', order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    let errorMessage = 'Error interno del servidor.';

    if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
      errorMessage = 'Índice requerido no encontrado en Firestore.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: 'Error interno del servidor.', error: errorMessage },
      { status: 500 }
    );
  }
}
