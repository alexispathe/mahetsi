// src/cart/OrderSummary.js
'use client'
import React from 'react';
import Link from 'next/link';

export default function OrderSummary({
  loading,
  loadingShipping,
  subtotal,
  shippingFee,
  grandTotal,
  isShippingPending
}) {
  // Si cualquiera de los dos sigue cargando, mostramos un skeleton
  if (loading || loadingShipping) {
    return (
      <section className="order-summary bg-[#1c1f28] text-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-5">
          {/* Título */}
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>

          {/* Subtotal */}
          <div className="flex justify-between mb-2">
            <div className="w-1/3 h-4 bg-gray-600 rounded"></div>
            <div className="w-1/6 h-4 bg-gray-600 rounded"></div>
          </div>

          {/* Envío */}
          <div className="flex justify-between mb-2">
            <div className="w-1/3 h-4 bg-gray-600 rounded"></div>
            <div className="w-1/6 h-4 bg-gray-600 rounded"></div>
          </div>

          {/* Total */}
          <div className="flex justify-between mb-6">
            <div className="w-1/2 h-4 bg-gray-600 rounded"></div>
            <div className="w-1/4 h-4 bg-gray-600 rounded"></div>
          </div>

          {/* Botón */}
          <div className="w-full h-10 bg-gray-500 rounded"></div>
        </div>
      </section>
    );
  }

  // Si ya no está cargando, se muestra el contenido real
  return (
    <section className="order-summary bg-[#1c1f28] text-white rounded-lg shadow-md p-6">
      <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>

      <div className="mb-4">
        {/* Subtotal */}
        <div className="flex justify-between mb-2">
          <p className="text-sm">Subtotal</p>
          <p className="font-semibold">${subtotal.toFixed(2)}</p>
        </div>

        {/* Envío */}
        <div className="flex justify-between mb-2">
          <p className="text-sm">Envío</p>
          <p className="font-semibold">${shippingFee.toFixed(2)}</p>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between mb-6">
        <p className="text-lg font-bold">
          Total {isShippingPending && <span className="text-sm font-normal">(+ Envío)</span>}
        </p>
        <p className="text-lg font-bold">
          ${grandTotal.toFixed(2)}
        </p>
      </div>

      <div className="w-full">
        <Link href="/checkout">
          <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600">
            Completar Pedido
          </button>
        </Link>
      </div>
    </section>
  );
}
