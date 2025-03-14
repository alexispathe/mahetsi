//Formulario para agregar código postal para invitados
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
      <div className="p-4 bg-green-50 rounded border border-green-200">
        <p className="text-sm text-green-700 mb-2">
          Ingresa tu código postal para cotizar el envío.
        </p>
        <button
          onClick={onEditGuestZip}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
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
        <p className="text-sm text-green-600">Cotizando envío...</p>
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

  // Si se encontraron cotizaciones, se muestran las diferentes paqueterías
  if (shippingQuotes.length > 0) {
    return (
      <div>
        <p className="text-sm  mt-3 mb-2 text-center">Selecciona una opción de envío:</p>
        <ul className="space-y-2">
          {shippingQuotes.map((quote) => (
            <li key={quote.id}>
              <button
                onClick={() => onSelectQuote(quote)}
                className={`w-full text-left px-4 py-2 rounded border transition-colors duration-300 ${
                  selectedQuote && selectedQuote.id === quote.id
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
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
      <p className="text-sm text-center">No se encontraron opciones de envío.</p>
      {currentUser && !shippingAddress && (
        <div className="mt-2 text-center">
          <button
            onClick={onEditAddress}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
          >
            Agregar Dirección de Envío
          </button>
        </div>
      )}
    </div>
  );
}
