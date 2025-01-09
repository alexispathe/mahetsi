// src/app/api/mercadopago/webhook/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

const client = new MercadoPagoConfig({
  accessToken: process.env.NODE_ENV === 'production' 
    ? process.env.MP_ACCESS_TOKEN 
    : process.env.MP_TEST_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Webhook recibido:', body);

    // Manejo de diferentes tipos de notificaciones
    let paymentId;
    
    if (body.type === 'payment' && body.data?.id) {
      // Notificación estándar de pago
      paymentId = body.data.id;
    } else if (body.selectedAddressId) {
      // Notificación de checkout
      // Guardar los datos del checkout y retornar
      await firestore.collection('checkout_data').add({
        ...body,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'Datos de checkout guardados'
      });
    } else {
      console.log('Tipo de notificación no manejada:', body);
      return NextResponse.json({ 
        message: 'Tipo de notificación no soportada' 
      }, { status: 200 });
    }

    try {
      // Si llegamos aquí, tenemos un paymentId válido
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });
      console.log('Información del pago:', paymentInfo);

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
        cartItems = [];
      }

      // Verificar orden existente
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
        paymentId,
        userId: metadata?.userId || null,
        items: cartItems,
        payment: {
          method: 'mercadopago',
          status: paymentInfo.status,
          transactionAmount: paymentInfo.transaction_amount || 0,
        },
        totals: {
          subtotal: Number(metadata?.total || 0),
          shipping: Number(metadata?.shipping || 0),
          tax: Number(metadata?.tax || 0),
          total: paymentInfo.transaction_amount || 0,
        },
        status: 'processing',
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Usar batch para operaciones atómicas
      const batch = firestore.batch();
      batch.set(orderRef, orderData);

      // Actualizar inventario si hay items
      if (cartItems.length > 0) {
        for (const item of cartItems) {
          const productRef = firestore.collection('products').doc(item.uniqueID);
          batch.update(productRef, {
            stock: admin.firestore.FieldValue.increment(-item.qty),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      await batch.commit();

      return NextResponse.json({
        success: true,
        message: 'Orden procesada correctamente',
        orderId: orderRef.id
      });

    } catch (error) {
      // Registrar error de procesamiento
      await firestore.collection('webhook_errors').add({
        type: 'payment_processing_error',
        paymentId: paymentId || null,
        error: error.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: {
          name: error.name || null,
          cause: error.cause || null
        }
      });
      
      return NextResponse.json({ 
        success: false,
        message: 'Error procesando el pago',
        error: error.message 
      }, { status: 200 });
    }

  } catch (error) {
    // Error general del webhook
    console.error('Error en webhook:', error);

    await firestore.collection('webhook_errors').add({
      type: 'webhook_error',
      error: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: {
        name: error.name || null,
        cause: error.cause || null
      }
    });

    return NextResponse.json({ 
      success: false,
      message: 'Error en webhook',
      error: error.message 
    }, { status: 200 });
  }
}