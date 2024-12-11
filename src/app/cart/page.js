// src/pages/cart/page.js

'use client'
import { useState, useEffect } from 'react';
import OrderSummary from './OrderSummary';
import '../styles/cartSummary.css'
import Header from '../components/Header';
import CartItems from './CartItems';
import { fetchCartProducts } from '../utils/fetchCartProducts';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]); // Items detallados del carrito
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const getCartProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const detailedItems = await fetchCartProducts();
        setCartItems(detailedItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCartProducts();
  }, []);

  const handleRemoveItem = async (uniqueID, size) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = cart.filter(item => !(item.uniqueID === uniqueID && item.size === size));
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Re-fetch the updated cart products
      const updatedDetailedItems = await fetchCartProducts();
      setCartItems(updatedDetailedItems);
    } catch (err) {
      console.error('Error al eliminar el producto del carrito:', err);
      setError('No se pudo eliminar el producto del carrito.');
    }
  };

  return (
    <>
      <Header position="relative" textColor="text-black" />
      <div className="cart-page mx-auto pt-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              // Skeleton mientras se cargan los productos
              <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                <div className="space-y-4">
                  {/* Skeleton para los productos */}
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-24 h-24 bg-gray-300 rounded-md animate-pulse mr-4"></div>
                        <div className="space-y-2">
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
            ) : error ? (
              <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                <p className="text-red-500 mb-6">Error: {error}</p>
              </section>
            ) : (
              <CartItems items={cartItems} handleRemoveItem={handleRemoveItem} />
            )}
          </div>
          <div>
            {loading ? (
              // Skeleton de OrderSummary
              <section className="order-summary bg-[#1c1f28] text-white rounded-lg shadow-md p-6">
                <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>
                {/* Skeleton para el resumen */}
                <div className="mb-4">
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                </div>
                {/* Skeleton para el cupón */}
                <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
                {/* Skeleton para los botones */}
                <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
                <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
              </section>
            ) : (
              <OrderSummary items={cartItems} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
