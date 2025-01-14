// src/app/api/cotizar/route.js
import { NextResponse } from 'next/server';

// Credenciales de la API
const AUTH_URL = 'https://pro.skydropx.com/api/v1/oauth/token';
const QUOTE_URL = 'https://pro.skydropx.com/api/v1/quotations';

// Función para obtener el token Bearer
async function getAuthToken() {
  const authData = {
    grant_type: 'client_credentials',
    client_id: process.env.SKYDROPX_API_KEY,
    client_secret: process.env.SKYDROPX_API_KEY_SECRET,
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    scope: 'default orders.create'
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

// Función que hace la primera cotización para obtener el ID
async function createQuotation(bearerToken, datosCotizacion) {
  const response = await fetch(QUOTE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`
    },
    body: JSON.stringify(datosCotizacion)
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Error al crear cotización inicial:', errorResponse);
    throw new Error(errorResponse.message || 'Error al crear cotización');
  }

  return response.json();
}

// Función que obtiene la cotización final con los precios reales
async function getQuotationById(bearerToken, quotationId) {
  // Aquí llamamos a la ruta de la doc: /api/v1/quotations/{id}
  const response = await fetch(`${QUOTE_URL}/${quotationId}`, {
    method: 'GET', // Ajustar si la doc pide POST + body
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`
    },
   
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Error al obtener cotización final:', errorResponse);
    throw new Error(errorResponse.message || 'Error al obtener cotización final');
  }

  return response.json();
}

// Función para esperar hasta que la cotización esté completada
async function esperarCotizacionCompleta(bearerToken, quotationId, maxIntentos = 5, intervalo = 2000) {
  for (let intento = 0; intento < maxIntentos; intento++) {
    const cotizacion = await getQuotationById(bearerToken, quotationId);
    if (cotizacion.is_completed) {
      return cotizacion;
    }
    // Espera el intervalo especificado antes de reintentar
    await new Promise((resolve) => setTimeout(resolve, intervalo));
  }
  throw new Error('La cotización no se completó en el tiempo esperado.');
}

// Ruta principal
export async function POST(request) {
  try {
    const { direccionDestino } = await request.json();

    // Dirección de origen (almacén)
    const direccionOrigen = {
      "country_code": 'MX',
      "postal_code": '76650',
      "area_level1": 'Queretaro', // Estado
      "area_level2": 'Queretaro', // Ciudad
      "area_level3": 'Centro', // Colonia
      "street1": 'C. Tierras y Aguas 18',
      "apartment_number": '123',
      "reference": 'Almacén principal',
      "name": 'Almacén',
      "phone": 9981234567,
      "email": 'almacen@gmail.com',
      "company": 'casa'
    };

    // Dirección de destino
    const destinoFormateado = {
      "country_code": 'MX',
      "postal_code": direccionDestino.zipcode || '00000',
      "area_level1": direccionDestino.state || 'Estado desconocido', // Estado
      "area_level2": direccionDestino.city || 'Ciudad desconocida',  // Ciudad
      "area_level3": direccionDestino.colonia || 'Sin colonia',      // Colonia
      "street1": direccionDestino.address || 'Sin calle',
      "apartment_number": direccionDestino.number || 'SN',           // Si no hay número
      "reference": direccionDestino.reference || '',
      "name": `${direccionDestino.firstName || 'Nombre'} ${direccionDestino.lastName || 'Desconocido'}`,
      "phone":  parseInt(direccionDestino.phone) || parseInt('0000000000'),
      "email": direccionDestino.email || 'email@ejemplo.com',
      "company": direccionDestino.company || 'casa'
    };

    const datosCotizacion = {
      "quotation": {
        "address_from": direccionOrigen,
        "address_to": destinoFormateado,
        "parcel": {
          "weight": 5,  // Peso fijo de 5kg
          "height": 8, // Alto fijo de 8cm
          "width": 5,  // Ancho fijo de 5cm
          "length": 1  // Largo fijo de 1cm
        },
        "requested_carriers": ["dhl", "fedex"] // Ejemplo pidiendo varias paqueterías
      }
    };

    // 1. Obtener token de autenticación
    const bearerToken = await getAuthToken();

    // 2. Crear la primera cotización
    const cotizacionInicial = await createQuotation(bearerToken, datosCotizacion);

    // 3. Sacamos el ID de la cotización
    const quotationId = cotizacionInicial.id;
    if (!quotationId) {
      throw new Error('No se recibió un ID de cotización');
    }

    // 4. Esperar hasta que la cotización esté completa
    const cotizacionFinal = await esperarCotizacionCompleta(bearerToken, quotationId);

    // 5. Filtrar las cotizaciones con precios disponibles
    const rates = cotizacionFinal.rates || [];
    const cotizacionesConPrecio = rates.filter((r) => r.total !== null && r.total !== undefined);

    // 6. Verificar si hay cotizaciones con precio
    if (cotizacionesConPrecio.length === 0) {
      throw new Error('No se encontraron cotizaciones disponibles con precios.');
    }

    // 7. Preparar todas las cotizaciones para enviarlas al frontend
    const allQuotesFormatted = cotizacionesConPrecio.map((r) => ({
      id: r.id,
      carrier: r.provider_name,
      service: r.provider_service_name,
      total_price: r.total,
      days: r.days
    }));

    // 8. Seleccionar la mejor (la más barata)
    const mejorCotizacion = cotizacionesConPrecio.reduce((prev, current) =>
      parseFloat(prev.total) < parseFloat(current.total) ? prev : current
    );

    // 9. Respuesta final con la mejor cotización y todas
    return NextResponse.json({
      shipping_cost: mejorCotizacion.total,
      carrier: mejorCotizacion.provider_name,
      service: mejorCotizacion.provider_service_name,
      estimated_days: mejorCotizacion.days,
      all_quotes: allQuotesFormatted
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
