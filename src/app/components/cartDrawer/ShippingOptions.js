'use client';

import React from 'react';
import { toast } from 'react-toastify';

/**
 * Sección de envío: muestra si es gratis, o la lista de cotizaciones,
 * y botones para editar dirección (Auth) o CP (Guest).
 */
export default function ShippingOptions({
  subtotal,
  shippingThreshold,
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
  // Handler local para seleccionar una cotización
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
        <span className="font-semibold text-green-700">¡Felicidades! Tu envío es gratis.</span>
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
      {shippingQuotes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Opciones de Envío</h3>
          <div className="space-y-2">
            {shippingQuotes.map((quote, index) => (
              <div
                key={quote.id || index}
                className="flex items-center p-2 border rounded"
              >
                <input
                  type="radio"
                  id={`quote-${index}`}
                  name="shippingQuote"
                  value={quote.id}
                  checked={selectedQuote && selectedQuote.id === quote.id}
                  onChange={() => handleSelectQuote(quote)}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`quote-${index}`} className="flex flex-col">
                  <span className="font-semibold">
                    {quote.carrier} - {quote.service}
                  </span>
                  <span className="text-gray-600">
                    Precio: ${parseFloat(quote.total_price).toFixed(2)}
                  </span>
                  <span className="text-gray-600">
                    Días estimados: {quote.days}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editar dirección (Auth) o CP (guest) */}
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
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
          >
            Editar CP (Actualmente: {guestZipCode})
          </button>
        )}
      </div>
    </div>
  );
}
