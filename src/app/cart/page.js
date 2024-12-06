'use client'

import { useState, useEffect } from 'react';
import OrderSummary from './OrderSummary';
import Header from '../components/Header';

function CartItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Cargar los productos del carrito desde localStorage cuando se monta el componente
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(cart);
  }, []);

  const handleRemoveItem = (uniqueID) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => item.uniqueID !== uniqueID);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setItems(updatedCart);
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
          <p className="text-gray-700">Tu carrito está vacío</p>
        </section>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        <div className="">
          {items.map((item, index) => (
            <div key={item.uniqueID || index} className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {/* Si guardas 'size' u otras propiedades en el localStorage, puedes mostrarlas */}
                  <p className="text-sm text-gray-500">Size: {item.size || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                <p className="text-sm text-gray-500">{item.qty} @ ${item.price.toFixed(2)}</p>
                <button 
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => handleRemoveItem(item.uniqueID)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


export default function CartPage() {
  return (
    <div className="cart-page mx-auto pt-20 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2"> 
          <CartItems />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
