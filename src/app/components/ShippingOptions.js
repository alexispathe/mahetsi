//Fomulario para agregar codigo postal para invitados
'use client';

import React from 'react';

export default function ShippingOptions({
  shippingQuotes,
  selectedQuote,
  loadingShipping,
  shippingError,
  currentUser,
  shippingAddress,
  guestZipCode,
  onSelectQuote,
  onEditAddress,
  onEditGuestZip,
}) {
  // Para usuarios invitados sin código postal guardado, mostramos un mensaje con el botón para agregar CP.
  if (!currentUser && !guestZipCode) {
    return (
      <div className="p-4  rounded">
        <p className="text-sm text-gray-600 mb-2">
          Ingresa tu código postal para cotizar el envío.
        </p>
        <button
          onClick={onEditGuestZip}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Agregar Código Postal
        </button>
      </div>
    );
  }

  // Mientras se está cargando la cotización
  if (loadingShipping) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-600">Cotizando envío...</p>
      </div>
    );
  }

  // Si ocurrió un error al cotizar
  if (shippingError) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-500">{shippingError}</p>
      </div>
    );
  }

  // Si se encontraron cotizaciones, se muestran las diferentes paqueterías (manteniendo el diseño original)
  if (shippingQuotes.length > 0) {
    return (
      <div>
        <p className="text-sm text-gray-600 mb-2">Selecciona una opción de envío:</p>
        <ul className="space-y-2">
          {shippingQuotes.map((quote) => (
            <li key={quote.id}>
              <button
                onClick={() => onSelectQuote(quote)}
                className={`w-full text-left px-4 py-2 rounded border transition-colors duration-300 ${
                  selectedQuote && selectedQuote.id === quote.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {quote.service} - ${parseFloat(quote.total_price).toFixed(2)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Si no se encontraron cotizaciones, se muestra un mensaje informativo.
  return (
    <div className="p-4">
      <p className="text-sm text-gray-600">No se encontraron opciones de envío.</p>
      {currentUser && !shippingAddress && (
        <div className="mt-2">
          <button
            onClick={onEditAddress}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Agregar Dirección de Envío
          </button>
        </div>
      )}
    </div>
  );
}
