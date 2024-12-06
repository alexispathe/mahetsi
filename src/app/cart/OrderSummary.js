'use client'

import { useState, useEffect } from 'react';
import { FaPaypal } from 'react-icons/fa'; // Usando el ícono de Paypal

export default function OrderSummary() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(cart);
  }, []);
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = 0.00; // Ajusta según tu lógica
  const salesTax = 45.89; // Ajusta según tu lógica
  const grandTotal = subtotal + shipping + salesTax;

  return (
    <section className="order-summary bg-[#1c1f28] text-white rounded-lg shadow-md p-6">
      <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>
      
      {/* Subtotal */}
      <div className="mb-4">
        <p className="text-sm">Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
      </div>

      {/* Envío */}
      <div className="mb-4">
        <p className="text-sm">Envío: <span className="font-semibold">Se calculará en el pago</span></p>
      </div>

      {/* Total */}
      <div className="mb-4">
        <p className="text-sm">
          Total: <span className="font-semibold">${grandTotal.toFixed(2)}</span>{" "}
          <span className="text-xs">(Incluye ${salesTax.toFixed(2)} impuestos)</span>
        </p>
      </div>

      {/* Cupón */}
      <div className="mb-4">
        <label className="text-sm">¿Tienes un cupón de descuento?</label>
        <input 
          type="text" 
          className="w-full p-3 mt-2 text-black rounded-md" 
          placeholder="Ingresa el cupón" 
        />
      </div>

      {/* Botones de Acción */}
      <div className="mt-4 space-y-4">
        <button className="w-full bg-white text-[#1c1f28] py-3 px-4 rounded-md hover:bg-gray-200">
          Proceder al pago
        </button>
        <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600">
          <FaPaypal className="inline-block mr-2 text-xl" /> Pagar con PayPal
        </button>
      </div>
    </section>
  );
}
