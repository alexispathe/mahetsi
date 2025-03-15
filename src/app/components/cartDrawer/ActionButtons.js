// src/app/components/cartDrawer/ActionButtons.js
'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Renderiza los botones de resumen del carrito y checkout.
 */
export default function ActionButtons({ onClose }) {
  return (
    <div className="mt-6 space-y-4">
      <Link href="/cart">
        <button onClick={onClose} className="w-full bg-green-100 text-green-700 py-3 rounded-lg hover:bg-green-200 transition-colors duration-300">
          Ver resumen del carrito
        </button>
      </Link>
      <Link href="/checkout">
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white mt-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
        >
          Pagar
        </button>
      </Link>
    </div>
  );
}
