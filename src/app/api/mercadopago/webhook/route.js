// src/app/api/mercadopago/webhook/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

// Inicializa Firebase Admin si no está ya inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // ... otras configuraciones si es necesario
  });
}

const client = new MercadoPagoConfig({
  accessToken: process.env.NODE_ENV === 'production' 
    ? process.env.MP_ACCESS_TOKEN 
    : process.env.MP_TEST_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    // Extraer los parámetros de consulta
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    const queryTopic = searchParams.get('topic');

    // Extraer el cuerpo de la solicitud
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      console.warn('No se pudo parsear el cuerpo de la solicitud como JSON:', e);
    }

    console.log('Webhook recibido:', body);

    let paymentId;
    let topic;

    // Determinar el tipo de notificación y extraer el ID
    if (body.type === 'payment' && body.data?.id) {
      paymentId = body.data.id;
      topic = body.type;
    } else if (body.topic === 'payment' && body.id) {
      paymentId = body.id;
      topic = body.topic;
    } else if (queryTopic === 'payment' && queryId) {
      paymentId = queryId;
      topic = queryTopic;
    } else if (body.topic === 'merchant_order') {
      // Ignorar notificaciones de tipo 'merchant_order'
      console.log('Notificación de tipo merchant_order ignorada.');
      return NextResponse.json({ message: 'Merchant order notification ignored' }, { status: 200 });
    } else {
      console.log('Notificación no reconocida:', body);
      return NextResponse.json({ message: 'Notificación no reconocida' }, { status: 200 });
    }

    // Verificar si ya existe una orden para este pago
    const existingOrderSnapshot = await firestore
      .collection('orders')
      .where('payment.id', '==', paymentId)
      .limit(1)
      .get();

    if (!existingOrderSnapshot.empty) {
      console.log('Ya existe una orden para este pago:', paymentId);
      return NextResponse.json({ 
        message: 'Orden ya procesada anteriormente',
        orderId: existingOrderSnapshot.docs[0].id 
      }, { status: 200 });
    }

    // Obtener información del pago
    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });
    console.log('Información del pago:', paymentInfo);

    if (paymentInfo.status !== 'approved') {
      console.log(`Pago no aprobado. Estado: ${paymentInfo.status}`);
      return NextResponse.json({ 
        message: `Pago no aprobado. Estado: ${paymentInfo.status}` 
      }, { status: 200 });
    }

    // Obtener el external_reference del pago
    const externalReference = paymentInfo.external_reference;

    if (!externalReference) {
      throw new Error('external_reference no encontrado en la información del pago.');
    }

    // Obtener la preferencia original usando external_reference
    const preferencesSnapshot = await firestore
      .collection('payment_preferences')
      .doc(externalReference)
      .get();

    if (!preferencesSnapshot.exists) {
      throw new Error(`Preferencia no encontrada para: ${externalReference}`);
    }

    const preferenceData = preferencesSnapshot.data();
    const metadata = preferenceData.metadata;
    const cartItems = JSON.parse(metadata.cartItems);

    // Obtener los detalles de la dirección seleccionada
    const addressSnapshot = await firestore
      .collection('addresses')
      .doc(metadata.selectedAddressId)
      .get();

    if (!addressSnapshot.exists) {
      throw new Error('Dirección no encontrada');
    }

    const address = addressSnapshot.data();

    // Obtener los detalles de los productos
    const productsSnapshot = await firestore
      .collection('products')
      .where('uniqueID', 'in', cartItems.map(item => item.uniqueID))
      .get();

    const productsMap = {};
    productsSnapshot.forEach((doc) => {
      productsMap[doc.data().uniqueID] = doc.data();
    });

    // Construir los detalles de los ítems
    const detailedItems = cartItems.map((item) => {
      const product = productsMap[item.uniqueID];
      if (!product) {
        throw new Error(`Producto con ID ${item.uniqueID} no encontrado.`);
      }
      return {
        uniqueID: item.uniqueID,
        name: product.name,
        price: product.price,
        qty: item.qty,
        total: product.price * item.qty,
        images: product.images[0],
      };
    });

    // Calcular totales
    const subtotal = detailedItems.reduce((acc, item) => acc + item.total, 0);
    const shipping = subtotal >= 255 ? 0 : 9.99;
    const salesTax = metadata.tax || 0; // Utilizar el tax de metadata si está disponible
    const grandTotal = subtotal + shipping + salesTax;

    // Iniciar batch de operaciones
    const batch = firestore.batch();

    // 1. Crear la orden
    const orderRef = firestore.collection('orders').doc();
    const orderData = {
      uniqueID: orderRef.id,
      ownerId: address.ownerId,
      shippingAddress: address,
      items: detailedItems,
      subtotal,
      shipping,
      salesTax,
      grandTotal,
      paymentMethod: 'mercadopago',
      shippingStatus: 'confirmado',
      orderStatus: 'pendiente',
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      payment: {
        id: paymentId,
        status: paymentInfo.status,
        details: {
          method: paymentInfo.payment_method_id,
          type: paymentInfo.payment_type_id,
          email: paymentInfo.payer.email
        }
      }
    };

    batch.set(orderRef, orderData);

    // 2. Actualizar el inventario y las ventas de los productos
    for (const item of cartItems) {
      const productRef = firestore.collection('products').doc(item.uniqueID);
      batch.update(productRef, {
        stock: admin.firestore.FieldValue.increment(-item.qty),
        totalSales: admin.firestore.FieldValue.increment(item.qty),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // 3. Limpiar el carrito del usuario
    const cartItemsRef = firestore
      .collection('carts')
      .doc(address.ownerId)
      .collection('items');

    const cartSnapshot = await cartItemsRef.get();
    cartSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 4. Marcar el pago como procesado en la preferencia
    batch.update(preferencesSnapshot.ref, {
      status: 'completed',
      orderId: orderRef.id,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    // Ejecutar todas las operaciones
    await batch.commit();

    console.log('Orden creada exitosamente:', orderRef.id);
    return NextResponse.json({
      success: true,
      message: 'Pago procesado correctamente',
      orderId: orderRef.id
    });

  } catch (error) {
    console.error('Error en webhook:', error);

    const errorData = {
      type: 'webhook_error',
      message: error.message || 'Error desconocido',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: {
        name: error.name || 'Unknown',
        code: error.code || 'UNKNOWN_ERROR',
        stack: error.stack || null
      }
    };

    try {
      await firestore.collection('webhook_errors').add(errorData);
    } catch (dbError) {
      console.error('Error al guardar el error en Firestore:', dbError);
    }

    return NextResponse.json({ 
      success: false,
      message: 'Error procesando webhook',
      error: error.message 
    }, { status: 200 }); // Mercado Pago espera un 200 incluso si hubo errores en el procesamiento
  }
}
