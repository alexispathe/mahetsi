import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

// Configurar Mercado Pago con el Access Token
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar que la notificación es de tipo "payment"
    const { action, data, type } = body;

    if (type !== 'payment' || action !== 'payment.created') {
      return NextResponse.json({ message: 'Notificación no válida' }, { status: 400 });
    }

    const paymentId = data.id;

    // Buscar el pago en Mercado Pago
    const payment = await mercadopago.payment.findById(paymentId);

    // Verificar que el pago fue aprobado
    if (payment.body.status !== 'approved') {
      return NextResponse.json({ message: 'Pago no aprobado' }, { status: 400 });
    }

    // Obtener los datos de la preferencia (que guardaste en el webhook como metadata)
    const { metadata } = payment.body;
    const selectedAddressId = metadata?.selectedAddressId;

    // Buscar la dirección seleccionada
    const addressSnapshot = await firestore
      .collection('addresses')
      .where('uniqueID', '==', selectedAddressId)
      .limit(1)
      .get();

    if (addressSnapshot.empty) {
      return NextResponse.json({ message: 'Dirección no encontrada' }, { status: 404 });
    }

    const address = addressSnapshot.docs[0].data();

    // Obtener los ítems del carrito, que deben haberse pasado como metadata
    const cartItems = metadata?.cartItems || [];

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'No hay ítems en el carrito' }, { status: 400 });
    }

    // Mapear los ítems del carrito para obtener los detalles de los productos
    const productIDs = cartItems.map(item => item.uniqueID);
    const productsSnapshot = await firestore
      .collection('products')
      .where('uniqueID', 'in', productIDs)
      .get();

    const productsMap = {};
    productsSnapshot.forEach(doc => {
      productsMap[doc.data().uniqueID] = doc.data();
    });

    const detailedItems = cartItems.map(item => {
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

    // Calcular los totales (puedes agregar más cálculos dinámicos si es necesario)
    const subtotal = detailedItems.reduce((acc, item) => acc + item.total, 0);
    const shipping = subtotal >= 255 ? 0 : 9.99; // Podrías usar alguna lógica más avanzada aquí
    const salesTax = 45.89; // Esto también puede ser dinámico
    const grandTotal = subtotal + shipping + salesTax;

    // Crear la nueva orden en Firestore
    const orderRef = firestore.collection('orders').doc();
    const newOrder = {
      uniqueID: orderRef.id,
      ownerId: payment.body.user_id, // El ID del comprador de Mercado Pago (si es necesario)
      shippingAddress: address,
      items: detailedItems,
      subtotal,
      shipping,
      salesTax,
      grandTotal,
      paymentMethod: 'mercadopago', // Método de pago
      orderStatus: 'aprobado', // Puedes modificar el estado según sea necesario
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Guardar la orden en la colección 'orders'
    await orderRef.set(newOrder);

    // Limpiar el carrito de compras, actualizar las ventas de los productos, etc.
    const cartRef = firestore.collection('carts').doc(payment.body.user_id).collection('items');
    const writeBatch = firestore.batch();

    cartItems.forEach(item => {
      // Eliminar el ítem del carrito
      const itemRef = cartRef.doc(item.uniqueID);
      writeBatch.delete(itemRef);

      // Actualizar las ventas del producto
      const productRef = firestore.collection('products').doc(item.uniqueID);
      writeBatch.update(productRef, {
        totalSales: admin.firestore.FieldValue.increment(item.qty),
      });
    });

    // Ejecutar todas las operaciones en batch
    await writeBatch.commit();

    // Confirmación de que el pago se procesó correctamente
    return NextResponse.json({ message: 'Pedido procesado correctamente', order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}

