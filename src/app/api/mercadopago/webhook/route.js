// src/app/api/mercadopago/webhook/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

// Inicializa Firebase Admin si no está ya inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const client = new MercadoPagoConfig({
  accessToken: process.env.NODE_ENV === 'production'
    ? process.env.MP_ACCESS_TOKEN
    : process.env.MP_TEST_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    // Extraer parámetros de la URL (por si vienen en la query string)
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    const queryTopic = searchParams.get('topic');

    // Intentar parsear el cuerpo de la solicitud
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      console.warn('No se pudo parsear el cuerpo de la solicitud como JSON:', e);
    }

    let paymentId;
    let topic;

    // Determinar el tipo de notificación y extraer el paymentId
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
      return NextResponse.json(
        { message: 'Merchant order notification ignored' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Notificación no reconocida' },
        { status: 200 }
      );
    }

    // Obtener información del pago desde Mercado Pago
    const payment = new Payment(client);
    const paymentResponse = await payment.get({ id: paymentId });
    
    // Extraer la información del pago de la respuesta, probando distintas propiedades
    const paymentInfo = paymentResponse.response || paymentResponse.data || paymentResponse;
    if (!paymentInfo) {
      throw new Error('No se pudo obtener la información del pago');
    }
    

    // Solo procesamos pagos aprobados
    if (paymentInfo.status !== 'approved') {
      return NextResponse.json({
        message: `Pago no aprobado. Estado: ${paymentInfo.status}`
      }, { status: 200 });
    }

    // Usar external_reference como identificador único
    const externalReference = paymentInfo.external_reference;
    if (!externalReference) {
      throw new Error('external_reference no encontrado en la información del pago.');
    }

    // Verificar si ya existe una orden con este external_reference
    const orderRef = firestore.collection('orders').doc(externalReference);
    const orderSnapshot = await orderRef.get();
    if (orderSnapshot.exists) {
      return NextResponse.json({
        message: 'Orden ya procesada anteriormente',
        orderId: orderRef.id,
      }, { status: 200 });
    }

    // Obtener la preferencia de pago usando external_reference como id
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
    const shippingType = metadata.shippingType;
    const shippingCost = metadata.shippingCost;

    // Obtener la dirección seleccionada
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
    const subtotal = detailedItems.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = subtotal + shippingCost;

    // Iniciar batch de operaciones
    const batch = firestore.batch();

    // 1. Crear la orden usando external_reference como ID fijo
    const orderData = {
      uniqueID: orderRef.id,
      ownerId: address.ownerId,
      shippingAddress: address,
      shippingType: shippingType,
      shippingCost: shippingCost,
      items: detailedItems,
      subtotal,
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
    }, { status: 200 });
  }
}
