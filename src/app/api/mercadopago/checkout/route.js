import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { firestore } from '@/libs/firebaseAdmin';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { cartItems, shipping, salesTax, selectedAddressId } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'El carrito está vacío' }, { status: 400 });
    }

    // Obtener los detalles de los productos
    const productIDs = cartItems.map(item => item.uniqueID);
    const productSnapshots = await firestore
      .collection('products')
      .where('uniqueID', 'in', productIDs)
      .get();

    const productsMap = {};
    productSnapshots.forEach(doc => {
      productsMap[doc.data().uniqueID] = doc.data();
    });

    // Construir los items para MP asegurándose de que los valores sean números
    const items = cartItems.map((item) => {
      const product = productsMap[item.uniqueID];
      if (!product) {
        throw new Error(`Producto con ID ${item.uniqueID} no encontrado.`);
      }
      return {
        id: product.uniqueID,
        title: product.name,
        unit_price: Number(product.price), // Asegurarse de que sea número
        quantity: Number(item.qty), // Asegurarse de que sea número
        currency_id: 'MXN', // O la moneda que corresponda
        picture_url: product.images?.[0] || null,
        description: product.description || product.name,
      };
    });

    // Calcular totales asegurándose de que sean números
    const subtotal = Number(
      cartItems.reduce((acc, item) => acc + (productsMap[item.uniqueID].price * item.qty), 0)
    );
    const shippingCost = Number(shipping);
    const taxCost = Number(salesTax);
    const total = subtotal + shippingCost + taxCost;

    // Crear el objeto de preferencia
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
        cartItems: JSON.stringify(cartItems), // Convertir a string para evitar problemas de formato
        total: total,
        shipping: shippingCost,
        tax: taxCost
      },
      shipments: {
        cost: shippingCost,
        mode: "not_specified",
      }
    };

    // Crear la preferencia
    const preference = new Preference(client);
    const response = await preference.create({
      body: preferenceData // Asegúrate de pasar los datos en el campo 'body'
    });

    // Retornar la respuesta
    return NextResponse.json({
      initPoint: process.env.NODE_ENV === 'production' 
        ? response.init_point 
        : response.sandbox_init_point,
      preferenceId: response.id,
    });

  } catch (error) {
    console.error('Error detallado:', error);
    return NextResponse.json({ 
      message: 'Error al crear la preferencia',
      error: error.message 
    }, { status: 500 });
  }
}