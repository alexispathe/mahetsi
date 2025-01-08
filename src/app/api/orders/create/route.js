// src/app/api/orders/create/route.js

import { NextResponse } from 'next/server';
import { verifySessionCookie, firestore } from '../../../../libs/firebaseAdmin';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    // Verificar la session cookie
    const decodedToken = await verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    // Obtener el cuerpo de la solicitud
    const { selectedAddressId, cartItems, paymentMethod } = await request.json();

    if (!selectedAddressId || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Datos del pedido inválidos' }, { status: 400 });
    }

    // Obtener los detalles de la dirección seleccionada
    const addressSnapshot = await firestore
      .collection('addresses')
      .where('uniqueID', '==', selectedAddressId)
      .where('ownerId', '==', uid)
      .limit(1)
      .get();

    if (addressSnapshot.empty) {
      return NextResponse.json({ message: 'Dirección no encontrada' }, { status: 404 });
    }

    const address = addressSnapshot.docs[0].data();

    // Obtener los detalles de los productos en el carrito
    const productIDs = cartItems.map((item) => item.uniqueID);

    // Firestore 'in' operator soporta hasta 10 elementos
    if (productIDs.length > 10) {
      return NextResponse.json({ message: 'Demasiados productos en el carrito.' }, { status: 400 });
    }

    const productsSnapshot = await firestore
      .collection('products')
      .where('uniqueID', 'in', productIDs)
      .get();

    const productsMap = {};
    productsSnapshot.forEach((doc) => {
      productsMap[doc.data().uniqueID] = doc.data();
    });

    // Construimos los detalles de los ítems en la orden
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
    const salesTax = 45.89; // Ejemplo estático
    const grandTotal = subtotal + shipping + salesTax;

    // Crear la nueva orden
    const orderRef = firestore.collection('orders').doc();
    const newOrder = {
      uniqueID: orderRef.id,
      ownerId: uid,
      shippingAddress: address,
      items: detailedItems,
      subtotal,
      shipping,
      salesTax,
      grandTotal,
      paymentMethod,
      orderStatus: 'pendiente',
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Guardar la orden
    await orderRef.set(newOrder);

    // Ahora, en el mismo proceso, vamos a eliminar ítems del carrito y
    // actualizar las ventas de cada producto en una sola operación en lote
    const cartRef = firestore.collection('carts').doc(uid).collection('items');
    const writeBatch = firestore.batch();

    cartItems.forEach((item) => {
      // 1) Borramos el ítem del carrito
      const itemRef = cartRef.doc(item.uniqueID);
      writeBatch.delete(itemRef);

      // 2) Actualizamos las ventas del producto
      const productRef = firestore.collection('products').doc(item.uniqueID);
      // Aumentar el campo total_sales con la cantidad comprada
      writeBatch.update(productRef, {
        totalSales: item.qty ,
      });
    });

    // Ejecutar la operación en lote
    await writeBatch.commit();

    return NextResponse.json(
      { message: 'Pedido realizado exitosamente', order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status: 500 }
    );
  }
}
