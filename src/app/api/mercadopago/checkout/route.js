//src/app/api/mercadopago/checkout/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';

// Para pruebas, usa el TEST ACCESS TOKEN
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_TEST_ACCESS_TOKEN, 
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { cartItems, shipping, salesTax, selectedAddressId } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'El carrito está vacío' }, { status: 400 });
    }

    const productIDs = cartItems.map(item => item.uniqueID);
    const productSnapshots = await firestore
      .collection('products')
      .where('uniqueID', 'in', productIDs)
      .get();

    const productsMap = {};
    productSnapshots.forEach(doc => {
      productsMap[doc.data().uniqueID] = doc.data();
    });

    // Configurar los items para pruebas
    const items = cartItems.map((item) => {
      const product = productsMap[item.uniqueID];
      if (!product) {
        throw new Error(`Producto con ID ${item.uniqueID} no encontrado.`);
      }
      return {
        id: product.uniqueID,
        title: product.name,
        unit_price: Number(product.price),
        quantity: Number(item.qty),
        currency_id: 'MXN',
        picture_url: product.images?.[0] || null,
        description: product.description || product.name,
      };
    });

    const subtotal = Number(
      cartItems.reduce((acc, item) => acc + (productsMap[item.uniqueID].price * item.qty), 0)
    );
    const shippingCost = Number(shipping);
    const taxCost = Number(salesTax);
    const total = subtotal + shippingCost + taxCost;

    // Configuración específica para pruebas
    const preferenceData = {
      items,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhook`,
      external_reference: selectedAddressId,
      metadata: {
        selectedAddressId,
        cartItems: JSON.stringify(cartItems),
        total: total,
        shipping: shippingCost,
        tax: taxCost
      },
      shipments: {
        cost: shippingCost,
        mode: "not_specified",
      },
      // Configuraciones adicionales para pruebas
      binary_mode: true, // Solo permite pagos aprobados o rechazados
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };

    const preference = new Preference(client);
    const response = await preference.create({
      body: preferenceData
    });

    // Para debugging en pruebas
    console.log('Preference created:', {
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });

    // En modo prueba, siempre usar sandbox_init_point
    return NextResponse.json({
      initPoint: response.sandbox_init_point,
      preferenceId: response.id
    });

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json({ 
      message: 'Error al crear la preferencia',
      error: error.message 
    }, { status: 500 });
  }
}