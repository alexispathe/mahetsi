'use client'
import { useEffect, useState } from 'react';
import '../styles/cartSummary.css'

export default function CartSummary() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Cargar los productos del carrito desde localStorage cuando se monte el componente
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(cart);
  }, []);

  // Calcular subtotal desde los ítems del carrito
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = 8.95; // Puedes ajustarlo según tu lógica
  const salesTax = 45.89; // Ejemplo tomado del código original
  const grandTotal = subtotal + shipping + salesTax;

  return (
    <section className="cart-summary bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-700 mb-6">Tu carrito está vacío</p>
      ) : (
        <>
          {/* List of items */}
          <div className="mb-6">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    {/* Asumiendo que guardaste un 'size' en el localStorage */}
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{item.qty} @ ${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              <p className="text-sm">Subtotal</p>
              <p className="font-semibold">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm">Shipping</p>
              <p className="font-semibold">${shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm">Grand Total</p>
              <p className="font-semibold">${grandTotal.toFixed(2)} <span className="text-xs">(Inc ${salesTax.toFixed(2)} sales tax)</span></p>
            </div>
          </div>
        </>
      )}

      {/* Coupon code input */}
      <div className="mb-6">
        <label className="block text-sm mb-2">Enter your coupon code</label>
        <div className="flex">
          <input 
            type="text" 
            className="w-full p-3 text-black rounded-md border border-gray-300"
            placeholder="Coupon code"
          />
          <button className="bg-orange-500 text-white py-3 px-6 rounded-md ml-4 hover:bg-orange-600">
            Apply
          </button>
        </div>
      </div>

      {/* Terms and conditions */}
      <div className="mb-6">
        <label className="text-sm flex items-center">
          <input type="checkbox" className="mr-2" />
          I agree to Alpine's <a href="#" className="text-blue-400">terms & conditions</a>
        </label>
      </div>

      {/* Complete order button */}
      <div>
        <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600">
          Complete Order
        </button>
      </div>
    </section>
  );
}
