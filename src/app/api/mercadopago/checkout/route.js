//src/app/api/mercadopago/checkout/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

// Configurar MercadoPago con el token correcto
const client = new MercadoPagoConfig({
  // Usar el token de producción o test según corresponda
  accessToken: process.env.NODE_ENV === 'production' 
    ? process.env.MP_ACCESS_TOKEN 
    : process.env.MP_TEST_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    // Registrar la notificación recibida
    const body = await request.json();
    console.log('Webhook recibido:', body);

    // Validar la notificación
    if (!body.data || !body.type) {
      throw new Error('Payload inválido');
    }

    // Solo procesar notificaciones de pago
    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'Evento ignorado - no es un pago' }, { status: 200 });
    }

    const paymentId = body.data.id;
    
    try {
      // Obtener información del pago usando el SDK
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });
      console.log('Información del pago:', paymentInfo);

      // Solo procesar pagos aprobados
      if (paymentInfo.status !== 'approved') {
        return NextResponse.json({ 
          message: `Pago no aprobado. Estado: ${paymentInfo.status}` 
        }, { status: 200 });
      }

      // Extraer metadata
      const { metadata } = paymentInfo;
      const selectedAddressId = metadata?.selectedAddressId;
      let cartItems = [];
      
      try {
        cartItems = metadata?.cartItems ? JSON.parse(metadata.cartItems) : [];
      } catch (e) {
        console.error('Error al parsear cartItems:', e);
        throw new Error('Error al parsear los items del carrito');
      }

      // Validar datos necesarios
      if (!selectedAddressId || !cartItems.length) {
        throw new Error('Datos insuficientes en metadata');
      }

      // Verificar si la orden ya existe
      const existingOrder = await firestore
        .collection('orders')
        .where('paymentId', '==', paymentId)
        .limit(1)
        .get();

      if (!existingOrder.empty) {
        return NextResponse.json({ 
          message: 'Orden ya procesada' 
        }, { status: 200 });
      }

      // Crear la orden
      const orderRef = firestore.collection('orders').doc();
      const orderData = {
        uniqueID: orderRef.id,
        paymentId: paymentId,
        userId: metadata.userId || null,
        items: cartItems,
        payment: {
          method: 'mercadopago',
          status: paymentInfo.status,
          transactionAmount: paymentInfo.transaction_amount,
        },
        totals: {
          subtotal: Number(metadata.total || 0),
          shipping: Number(metadata.shipping || 0),
          tax: Number(metadata.tax || 0),
          total: paymentInfo.transaction_amount,
        },
        status: 'processing',
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Usar batch para operaciones atómicas
      const batch = firestore.batch();
      batch.set(orderRef, orderData);

      // Actualizar inventario
      for (const item of cartItems) {
        const productRef = firestore.collection('products').doc(item.uniqueID);
        batch.update(productRef, {
          stock: admin.firestore.FieldValue.increment(-item.qty),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await batch.commit();

      return NextResponse.json({
        success: true,
        message: 'Orden procesada correctamente',
        orderId: orderRef.id
      }, { status: 200 });

    } catch (error) {
      // Registrar el error específico de procesamiento
      const errorData = {
        type: 'payment_processing_error',
        paymentId,
        error: error.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: {
          name: error.name,
          code: error.code,
          cause: error.cause
        }
      };

      await firestore.collection('webhook_errors').add(errorData);
      
      // Siempre retornar 200 para que MP no reintente
      return NextResponse.json({ 
        success: false,
        message: 'Error procesando el pago',
        error: error.message 
      }, { status: 200 });
    }

  } catch (error) {
    // Error general del webhook
    console.error('Error en webhook:', error);

    const errorData = {
      type: 'webhook_error',
      error: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: {
        name: error.name,
        code: error.code
      }
    };

    await firestore.collection('webhook_errors').add(errorData);

    return NextResponse.json({ 
      success: false,
      message: 'Error en webhook',
      error: error.message 
    }, { status: 200 });
  }
}