// src/components/OrderSummary.js

import React from 'react';
import { FaPaypal } from 'react-icons/fa'; 
import Link from 'next/link'; 

export default function OrderSummary({ items }) {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal >= 255 ? 0 : 9.99;
  const salesTax = 45.89; 
  const grandTotal = subtotal + shipping + salesTax;

  if (!items) {
    return null;
  }

  return (
    <section className="order-summary bg-[#1c1f28] text-white rounded-lg shadow-md p-6">
      <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>
      
      <div className="mb-4">
        <p className="text-sm">Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
      </div>
      <div className="mb-4">
        <p className="text-sm">Envío: <span className="font-semibold">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span></p>
      </div>
      <div className="mb-4">
        <p className="text-sm">
          Total: <span className="font-semibold">${grandTotal.toFixed(2)}</span> <span className="text-xs">(Incluye ${salesTax.toFixed(2)} impuestos)</span>
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-2">¿Tienes un cupón de descuento?</label>
        <div className="flex">
          <input 
            type="text" 
            className="w-full p-3 text-black rounded-md border border-gray-300"
            placeholder="Ingresa el cupón"
          />
          <button className="bg-orange-500 text-white py-3 px-6 rounded-md ml-4 hover:bg-orange-600">
            Aplicar
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm flex items-center">
          <input type="checkbox" className="mr-2" />
          Acepto los <a href="#" className="text-blue-400">términos y condiciones</a> de Alpines
        </label>
      </div>

      <div className="mt-4 space-y-4">
        <Link href="/checkout">
          <button className="w-full bg-white text-[#1c1f28] py-3 px-4 rounded-md hover:bg-gray-200">
            Proceder al pago
          </button>
        </Link>
        <Link href="/checkout">
          <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600">
            <FaPaypal className="inline-block mr-2 text-xl" /> Pagar con PayPal
          </button>
        </Link>
      </div>
    </section>
  );
}
