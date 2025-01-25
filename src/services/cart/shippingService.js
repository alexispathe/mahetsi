// src/services/shippingService.js

/**
 * Obtiene cotizaciones de envío desde el servidor.
 * @param {Object} direccionDestino - Dirección de destino para el envío.
 */
export const fetchShippingQuotesAPI = async (direccionDestino) => {
    const response = await fetch('/api/cotizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direccionDestino }),
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || 'Error fetching shipping quotes');
    }
    return data.all_quotes;
  };
  