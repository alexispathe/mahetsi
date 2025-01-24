// src/app/api/mercadopago/checkout/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.NODE_ENV === 'production' 
    ? process.env.MP_ACCESS_TOKEN 
    : process.env.MP_TEST_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar el body
    if (!body.cartItems || !body.selectedAddressId || !body.selectedQuote) {
      return NextResponse.json({ 
        success: false, 
        message: 'Datos incompletos' 
      }, { status: 400 });
    }

    // Obtener los productos de Firestore para validar precios
    const productsRef = firestore.collection('products');
    const productsSnapshot = await Promise.all(
      body.cartItems.map(item => productsRef.doc(item.uniqueID).get())
    );

    // Crear los items para la preferencia de Mercado Pago
    const items = productsSnapshot.map((doc, index) => {
      const product = doc.data();
      const cartItem = body.cartItems[index];
      
      return {
        id: cartItem.uniqueID,
        title: "Tienda Mahets'i'",
        quantity: cartItem.qty,
        unit_price: product.price,
        currency_id: "MXN"
      };
    });

    // Configurar el costo de envío usando shipments
    const shipments = {
      cost: parseFloat(body.selectedQuote.total_price),
    };

    // Calcular totales (sin impuestos)
    const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) + shipments.cost;

    // Crear referencia única para external_reference
    const paymentPreferenceRef = firestore.collection('payment_preferences').doc();
    const uniqueExternalReference = paymentPreferenceRef.id;

    // Crear preferencia de pago
    const preference = new Preference(client);
    const preferenceData = {
      items: items, //Productos
      shipments: shipments, // metodo de envio
      metadata: {
        selectedAddressId: body.selectedAddressId, //Direccion del usuario
        cartItems: JSON.stringify(body.cartItems),
        shippingType: `${body.selectedQuote.carrier} - ${body.selectedQuote.service} - ${body.selectedQuote.days} días`,
        shippingCost: shipments.cost, // Costo de envío
        total: total
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/user`, // Reemplaza con tu dominio real
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhook`, 
      statement_descriptor: "Mahetsi",
      external_reference: uniqueExternalReference // Usar el ID único aquí
    };

    const response = await preference.create({ body: preferenceData });

    // Guardar la preferencia en Firestore usando el ID único
    await paymentPreferenceRef.set({
      preferenceId: response.id,
      metadata: preferenceData.metadata,
      status: 'created',
      createdAt: new Date(),
      items: items
    });

    return NextResponse.json({
      success: true,
      initPoint: response.init_point,
      preferenceId: response.id
    });

  } catch (error) {
    console.error('Error en checkout:', error);

    const errorData = {
      type: 'checkout_error',
      message: error.message || 'Error desconocido',
      timestamp: new Date(),
      details: {
        name: error.name || 'Unknown',
        code: error.code || 'UNKNOWN_ERROR'
      }
    };

    await firestore.collection('checkout_errors').add(errorData);

    return NextResponse.json({ 
      success: false,
      message: 'Error al crear la preferencia de pago'
    }, { status: 500 });
  }
}
