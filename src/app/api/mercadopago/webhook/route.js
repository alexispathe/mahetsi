// src/app/api/mercadopago/webhook/route.js
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
    const searchParams = request.nextUrl?.searchParams;
    const body = await request.json();
    
    console.log('Webhook recibido:', body);

    let paymentId;
    
    if (body.type === 'payment' && body.data?.id) {
      paymentId = body.data.id;
    } else if (searchParams?.get('topic') === 'payment' && searchParams?.get('id')) {
      paymentId = searchParams.get('id');
    } else if (body.topic === 'merchant_order' || body.type === 'merchant_order') {
      return NextResponse.json({ message: 'Merchant order notification ignored' }, { status: 200 });
    } else {
      console.log('Notificación no reconocida:', body);
      return NextResponse.json({ message: 'Notificación no reconocida' }, { status: 200 });
    }

    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });
    console.log('Información del pago:', paymentInfo);

    if (paymentInfo.status !== 'approved') {
      console.log(`Pago no aprobado. Estado: ${paymentInfo.status}`);
      return NextResponse.json({ 
        message: `Pago no aprobado. Estado: ${paymentInfo.status}` 
      }, { status: 200 });
    }

    const existingPayment = await firestore
      .collection('processed_payments')
      .doc(paymentId.toString())
      .get();

    if (existingPayment.exists) {
      console.log('Pago ya procesado:', paymentId);
      return NextResponse.json({ message: 'Pago ya procesado' }, { status: 200 });
    }

    // Obtener la preferencia original usando external_reference
    const preferencesSnapshot = await firestore
      .collection('payment_preferences')
      .where('metadata.selectedAddressId', '==', paymentInfo.external_reference)
      .limit(1)
      .get();

    if (preferencesSnapshot.empty) {
      throw new Error(`Preferencia no encontrada para: ${paymentInfo.external_reference}`);
    }

    const preferenceData = preferencesSnapshot.docs[0].data();
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
    const salesTax = 45.89;
    const grandTotal = subtotal + shipping + salesTax;

    // Iniciar batch de operaciones
    const batch = firestore.batch();

    // 1. Crear la orden con la misma estructura que antes
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
      orderStatus: 'confirmado', // Ya está pagado
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

    // 2. Marcar el pago como procesado
    const processedPaymentRef = firestore.collection('processed_payments').doc(paymentId.toString());
    batch.set(processedPaymentRef, {
      orderId: orderRef.id,
      status: paymentInfo.status,
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 3. Actualizar el inventario y las ventas de los productos
    for (const item of cartItems) {
      const productRef = firestore.collection('products').doc(item.uniqueID);
      batch.update(productRef, {
        stock: admin.firestore.FieldValue.increment(-item.qty),
        totalSales: admin.firestore.FieldValue.increment(item.qty),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // 4. Limpiar el carrito del usuario
    const cartItemsRef = firestore
      .collection('carts')
      .doc(address.ownerId)
      .collection('items');

    const cartSnapshot = await cartItemsRef.get();
    cartSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
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
    }, { status: 200 });
  }
}