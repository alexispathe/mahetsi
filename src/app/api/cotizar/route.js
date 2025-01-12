// src/app/api/cotizar/route.js
import { NextResponse } from 'next/server';

// Credenciales de la API
const clientId = '8L2s5LqWExOHNYXeolkrea5A7AD0p2CKB99Z4BSwK3c';
const apiSecret = 'xHA6rcLBEDqrpl4YsEhmeMqTLk1U82NADBjeNO_Up50';
const AUTH_URL = 'https://pro.skydropx.com/api/v1/oauth/token';
const QUOTE_URL = 'https://pro.skydropx.com/api/v1/quotations';

// Función para obtener el token Bearer
async function getAuthToken() {
  const authData = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: apiSecret
  };

  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  });

  if (!response.ok) {
    throw new Error(`Error de autenticación: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Función para obtener cotizaciones de envío
async function getShippingQuotes(bearerToken, datosCotizacion) {
  const response = await fetch(QUOTE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
    body: JSON.stringify(datosCotizacion)
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Error en cotización:', errorResponse);
    throw new Error(errorResponse.message || 'Error al obtener cotización');
  }

  return response.json();
}

// Ruta principal
export async function POST(request) {
  try {
    const { direccionDestino } = await request.json();

    // Dirección de origen (almacén)
    const direccionOrigen = {
      street: 'Av. Tulum',
      number: '123',
      district: 'Centro',
      city: 'Cancún',
      state: 'Quintana Roo',
      postal_code: '77500',
      country_code: 'MX'
    };

    // Formatear dirección de destino según la API de Skydropx
    const destinoFormateado = {
      street: direccionDestino.address || 'Sin calle',
      number: direccionDestino.number || 'SN', // Si no hay número, usamos 'SN'
      district: direccionDestino.colonia || 'Sin colonia',
      city: direccionDestino.city || 'Ciudad desconocida',
      state: direccionDestino.state || 'Estado desconocido',
      postal_code: direccionDestino.zipcode || '00000',
      country_code: 'MX',
      reference: direccionDestino.reference || '',
      between_streets: direccionDestino.betweenStreets || '',
      name: `${direccionDestino.firstName || 'Nombre'} ${direccionDestino.lastName || 'Desconocido'}`,
      phone: direccionDestino.phone || '0000000000',
      email: direccionDestino.email || 'email@ejemplo.com'
    };

    const datosCotizacion = {
      zip_from: direccionOrigen.postal_code,
      zip_to: destinoFormateado.postal_code,
      parcel: {
        weight: 2, // Peso fijo de 2kg
        height: 13, // Alto fijo de 13cm
        width: 10,  // Ancho fijo de 10cm
        length: 20  // Largo fijo de 20cm
      },
      carriers: ['fedex', 'estafeta', 'dhl'], // Lista de transportistas válidos
      address_from: direccionOrigen,
      address_to: destinoFormateado
    };

    console.log('Datos de cotización:', datosCotizacion);

    // Obtener token de autenticación
    const bearerToken = await getAuthToken();
    console.log('Token obtenido exitosamente');

    // Obtener cotizaciones
    const cotizacionData = await getShippingQuotes(bearerToken, datosCotizacion);

    // Procesar las cotizaciones
    const cotizaciones = cotizacionData.included
      ?.filter(quote => quote.attributes.success)
      .map(quote => ({
        carrier: quote.attributes.carrier,
        service: quote.attributes.service_level,
        total_price: quote.attributes.total_price,
        days: quote.attributes.days,
        currency: quote.attributes.currency
      })) || [];

    if (cotizaciones.length === 0) {
      throw new Error('No se encontraron cotizaciones disponibles');
    }

    // Seleccionar la mejor cotización
    const mejorCotizacion = cotizaciones.reduce((prev, current) =>
      prev.total_price < current.total_price ? prev : current
    );

    return NextResponse.json({
      shipping_cost: mejorCotizacion.total_price,
      carrier: mejorCotizacion.carrier,
      service: mejorCotizacion.service,
      estimated_days: mejorCotizacion.days,
      all_quotes: cotizaciones
    });

  } catch (error) {
    console.error('Error en cotización:', error);
    return NextResponse.json(
      {
        error: error.message || 'Error al procesar la cotización',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
