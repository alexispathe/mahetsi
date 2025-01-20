// src/cart/OrderSummary.js

'use client'
import React from 'react';
import Link from 'next/link';

export default function OrderSummary({ subtotal, shippingFee, grandTotal, isShippingPending }) {
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
