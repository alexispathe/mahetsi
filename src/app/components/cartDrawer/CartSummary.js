'use client';

import React from 'react';

/**
 * Muestra el subtotal, costo de envío (si aplica) y total.
 */
export default function CartSummary({
  subtotal,
  shippingFee,
  total,
  shippingThreshold,
  selectedQuote
}) {
  return (
    <div>
      <div className="flex justify-between mt-4 font-semibold text-lg text-gray-800">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {/* Mostrar envío solo si NO es gratis y sí tenemos una cotización */}
      {subtotal < shippingThreshold && selectedQuote && (
        <div className="flex justify-between mt-2 font-semibold text-lg text-gray-800">
          <span>Envío</span>
          <span>${shippingFee.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between mt-2 font-bold text-xl text-gray-900">
        <span>Total</span>
        <span>
          ${total.toFixed(2)}
          {subtotal < shippingThreshold && !selectedQuote && ' (+ Envío)'}
        </span>
      </div>
    </div>
  );
}
