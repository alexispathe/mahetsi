'use client'
import { useState, useEffect } from 'react';
import OrderSummary from './OrderSummary';
import '../styles/cartSummary.css'
import Header from '../components/Header';

function CartItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(cart);

    // Simular un retraso para la carga
    setTimeout(() => {
      setLoading(false); // Cambiar el estado a false después de 1 segundo
    }, 1000); // 1 segundo de retraso para simular carga
  }, []);

  const handleRemoveItem = (uniqueID) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => item.uniqueID !== uniqueID);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setItems(updatedCart);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = 8.95; // Ajusta según tu lógica
  const salesTax = 45.89; // Ejemplo tomado del código original
  const grandTotal = subtotal + shipping + salesTax;

  if (loading) {
    return (
      <>
        <Header />
        <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
          <div className="space-y-4">
            {/* Skeleton para los productos */}
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-md animate-pulse mr-4"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
        <div className="">
          {items.map((item, index) => (
            <div key={item.uniqueID || index} className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                <div>
                  <p className="font-semibold">{item.name}</p>
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
