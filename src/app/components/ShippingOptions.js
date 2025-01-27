'use client';

import React from 'react';
import { toast } from 'react-toastify';

export default function ShippingOptions({
  /** Datos principales */
  subtotal,
  shippingThreshold,
  shippingQuotes,
  selectedQuote,
  loadingShipping,
  shippingError,

  /** Info de usuario e invitado */
  currentUser,
  shippingAddress,
  guestZipCode,

  /** Callbacks */
  onSelectQuote,
  onEditAddress,
  onEditGuestZip,
}) {
  // Handler local para la selección de una cotización
  const handleSelectQuote = (quote) => {
    onSelectQuote(quote);
    toast.success(
      `Has seleccionado ${quote.carrier} - ${quote.service} por $${parseFloat(quote.total_price).toFixed(2)}`
    );
  };

  // Si ya aplica envío gratis
  if (subtotal >= shippingThreshold) {
    return (
      <div className="flex justify-between items-center bg-green-100 p-4 rounded-md mt-6">
        <span className="font-semibold text-green-700">
          ¡Felicidades! Tu envío es gratis.
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Mensajes de estado */}
      {loadingShipping && (
        <p className="text-gray-600 mt-4">Calculando envío...</p>
      )}
      {shippingError && (
        <p className="text-red-500 mt-4">Error: {shippingError}</p>
      )}

      {/* Mostrar cotizaciones si existen */}
      {shippingQuotes.length > 0 && !loadingShipping && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Opciones de Envío</h3>
          <div className="space-y-2">
            {shippingQuotes.map((quote, index) => (
              <label
                key={quote.id || index}
                htmlFor={`quote-${index}`}
                className={`flex items-center p-4 border rounded-md cursor-pointer ${
                  selectedQuote && selectedQuote.id === quote.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  id={`quote-${index}`}
                  name="shippingQuote"
                  value={quote.id}
                  checked={selectedQuote && selectedQuote.id === quote.id}
                  onChange={() => handleSelectQuote(quote)}
                  className="mr-4 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {quote.carrier} - {quote.service}
                  </span>
                  <span className="text-gray-600">
                    Precio: ${parseFloat(quote.total_price).toFixed(2)}
                  </span>
                  <span className="text-gray-600">
                    Días estimados: {quote.days}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Botones para editar dirección o CP */}
      <div className="mt-4">
        {currentUser && shippingAddress && (
          <button
            onClick={onEditAddress}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
          >
            Editar Dirección de Envío
          </button>
        )}

        {!currentUser && guestZipCode && (
          <button
            onClick={onEditGuestZip}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300 mt-2"
          >
            Editar CP (Actualmente: {guestZipCode})
          </button>
        )}
      </div>
    </div>
  );
}
