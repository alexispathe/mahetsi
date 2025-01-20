'use client';

import React from 'react';

/**
 * Muestra la barra de progreso para llegar a envío gratis,
 * o un mensaje indicando que el envío es gratis si ya alcanzamos el monto.
 */
export default function FreeShippingProgress({ subtotal, shippingThreshold }) {
  // Cálculo de progreso
  const shippingProgress = Math.min(
    100,
    (subtotal / shippingThreshold) * 100
  );

  const missingAmount = Math.max(0, shippingThreshold - subtotal).toFixed(2);

  return (
    <div className="mb-4">
      <div className="flex justify-between">
        {subtotal < shippingThreshold ? (
          <>
            <span className="text-sm text-gray-600">
              ${missingAmount} para envío gratis
            </span>
            <span className="text-sm text-gray-600">
              {`$${missingAmount} para envío gratis`}
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-600">¡Tienes envío gratuito!</span>
        )}
      </div>

      <div className="h-2 bg-gray-200 rounded-full mt-1">
        <div
          className="h-full bg-green-600 rounded-full"
          style={{ width: `${shippingProgress}%` }}
        />
      </div>
    </div>
  );
}
