'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Renderiza los botones de resumen del carrito y checkout.
 */
export default function ActionButtons() {
  return (
    <div className="mt-6 space-y-4">
      <Link href="/cart">
        <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300">
          Ver resumen del carrito
        </button>
      </Link>
      <Link href="/checkout">
        <button className="w-full bg-orange-600 text-white mt-4 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-300">
          Pagar
        </button>
      </Link>
    </div>
  );
}
