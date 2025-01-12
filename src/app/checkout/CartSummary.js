'use client';

import React, { useContext, useState } from 'react';
import { CartContext } from '@/context/CartContext';
import TermsModal from './TermsModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartSummary({ selectedAddressId, addresses, shippingCost, loadingShipping }) {
  const { cartItems, products, loading, error, clearCart } = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();

  const detailedCartItems = cartItems.map(cartItem => {
    const product = products.find(p => p.uniqueID === cartItem.uniqueID);
    return {
      ...cartItem,
      name: product ? product.name : 'Producto no encontrado',
      url: product ? product.url : '#',
      image: product ? product.image : '',
      price: product ? product.price : 0,
    };
  });

  const subtotal = detailedCartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const salesTax = 45.89;
  const grandTotal = subtotal + (shippingCost || 0) + salesTax;

  const handleCompleteOrderClick = async () => {
    if (!selectedAddressId) {
      alert('Por favor, selecciona una dirección de envío antes de completar el pedido.');
      return;
    }

    if (!isAccepted) {
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/mercadopago/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedAddressId,
          cartItems,
          shipping: shippingCost,
          salesTax,
        }),
      });

      const result = await response.json();

      if (response.ok && result.initPoint) {
        window.location.href = result.initPoint;
      } else {
        alert(result.message || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error al completar el pedido:', error);
      alert('Error al procesar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Resumen del Carrito</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 mb-6">Error: {error}</p>
      ) : detailedCartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-700 mb-6">Tu carrito está vacío</p>
          <Link href="/">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Volver al inicio
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Productos en tu Carrito</h3>
            <div className="space-y-4">
              {detailedCartItems.map(item => (
                <div key={item.uniqueID} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                    <div>
                      <h4 className="text-lg font-semibold">{item.name}</h4>
                      <p className="text-gray-600">Precio por unidad: ${item.price.toFixed(2)}</p>
                      <p className="text-gray-600">Cantidad: {item.qty}</p>
                      <p className="text-gray-800 font-semibold">Total: ${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-6 px-4 rounded-md bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Resumen del Pedido</h3>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Subtotal</p>
              <p className="font-semibold">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Envío</p>
              <p className="font-semibold">{loadingShipping ? 'Cargando...' : shippingCost ? `$${shippingCost.toFixed(2)}` : 'Selecciona una dirección'}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm">Total</p>
              <p className="font-semibold">
                ${grandTotal.toFixed(2)} <span className="text-xs">(Incluye ${salesTax.toFixed(2)} impuestos)</span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={isAccepted}
              onChange={() => setIsAccepted(!isAccepted)}
            />
            <label className="text-sm">
              Acepto los{' '}
              <button onClick={() => setIsModalOpen(true)} className="text-blue-400 hover:underline">
                términos y condiciones
              </button>
            </label>
          </div>

          {showAlert && (
            <div className="text-red-500 mb-4 p-2 bg-red-100 rounded-md">
              Debes aceptar los términos y condiciones antes de completar el pedido.
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handleCompleteOrderClick}
              className={`w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>
          </div>

          <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      )}
    </section>
  );
}
