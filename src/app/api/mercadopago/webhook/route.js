//src/app/api/mercadopago/webhook/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

// Configurar MercadoPago con el nuevo SDK
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    // Verificar que la solicitud viene de MercadoPago
    const mpSignature = request.headers.get('x-signature');
    if (!mpSignature) {
      console.warn('Intento de acceso sin firma de MercadoPago');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Webhook received:', body);

    // Validar la notificación
    const { action, data, type } = body;

    if (type !== 'payment' || !['payment.created', 'payment.updated'].includes(action)) {
      return NextResponse.json({ message: 'Notificación no procesable' }, { status: 200 });
    }

    const paymentId = data.id;
    
    // Usar el nuevo SDK para buscar el pago
    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    // Verificar el estado del pago
    if (paymentInfo.status !== 'approved') {
      console.log(`Pago ${paymentId} no está aprobado. Estado: ${paymentInfo.status}`);
      return NextResponse.json({ message: 'Pago no aprobado' }, { status: 200 });
    }

    // Obtener y parsear los metadatos
    const { metadata } = paymentInfo;
    const selectedAddressId = metadata?.selectedAddressId;
    const cartItems = metadata?.cartItems ? JSON.parse(metadata.cartItems) : [];

    // Validaciones básicas
    if (!selectedAddressId || !cartItems.length) {
      throw new Error('Datos insuficientes en metadata');
    }

    // Verificar si la orden ya existe para evitar duplicados
    const existingOrder = await firestore
      .collection('orders')
      .where('paymentId', '==', paymentId)
      .limit(1)
      .get();

    if (!existingOrder.empty) {
      console.log(`Orden ya procesada para el pago ${paymentId}`);
      return NextResponse.json({ message: 'Orden ya procesada' }, { status: 200 });
    }

    // Obtener la dirección
    const addressDoc = await firestore.collection('addresses').doc(selectedAddressId).get();
    if (!addressDoc.exists) {
      throw new Error('Dirección no encontrada');
    }
    const address = addressDoc.data();

    // Obtener productos en una sola consulta
    const productsRef = firestore.collection('products');
    const productIDs = cartItems.map(item => item.uniqueID);
    const productsSnapshot = await productsRef
      .where('uniqueID', 'in', productIDs)
      .get();

    const productsMap = Object.fromEntries(
      productsSnapshot.docs.map(doc => [doc.data().uniqueID, doc.data()])
    );

    // Verificar que todos los productos existen
    const missingProducts = productIDs.filter(id => !productsMap[id]);
    if (missingProducts.length > 0) {
      throw new Error(`Productos no encontrados: ${missingProducts.join(', ')}`);
    }

    // Crear la orden
    const batch = firestore.batch();
    const orderRef = firestore.collection('orders').doc();
    const newOrder = {
      uniqueID: orderRef.id,
      paymentId: paymentId,
      userId: metadata.userId || null,
      shippingAddress: address,
      items: cartItems.map(item => ({
        ...item,
        productDetails: productsMap[item.uniqueID],
      })),
      payment: {
        method: 'mercadopago',
        status: paymentInfo.status,
        transactionAmount: paymentInfo.transaction_amount,
        installments: paymentInfo.installments,
        paymentMethodId: paymentInfo.payment_method_id,
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

    // Guardar la orden
    batch.set(orderRef, newOrder);

    // Actualizar inventario y ventas
    cartItems.forEach(item => {
      const productRef = productsRef.doc(item.uniqueID);
      batch.update(productRef, {
        stock: admin.firestore.FieldValue.increment(-item.qty),
        totalSales: admin.firestore.FieldValue.increment(item.qty),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    // Ejecutar todas las operaciones
    await batch.commit();

    // Enviar confirmación
    return NextResponse.json({
      success: true,
      message: 'Orden procesada correctamente',
      orderId: orderRef.id
    }, { status: 200 });

  } catch (error) {
    console.error('Error en webhook:', error);
    
    // Registrar el error en Firestore para debugging
    await firestore.collection('webhook_errors').add({
      error: error.message,
      stack: error.stack,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Siempre devolver 200 para que MP no reintente
    return NextResponse.json({ 
      success: false,
      message: 'Error procesando la orden',
      error: error.message 
    }, { status: 200 });
  }
}