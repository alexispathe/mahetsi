// src/cart/page.js

'use client'
import { useState, useEffect } from 'react';
import OrderSummary from './OrderSummary';
import '../styles/cartSummary.css'
import Header from '../components/Header';
import CartItems from './CartItems';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cart/getItems', { method: 'GET' });
      if (!res.ok) {
        if (res.status === 401) {
          // Usuario no autenticado
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        throw new Error(data.error || 'Error al obtener el carrito');
      }

      const data = await res.json();
      const firestoreItems = data.cartItems; // [{ uniqueID, size, qty }, ...]

      if (firestoreItems.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const uniqueIDs = firestoreItems.map(i => i.uniqueID);
      // Ahora enriquecemos datos consultando la API que ya tienes
      const response = await fetch('/api/shoppingCart/public/get/cartIds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIDs: uniqueIDs })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener detalles de productos.');
      }

      const enrichedData = await response.json();
      const allProducts = enrichedData.products;

      const detailedItems = firestoreItems.map(cartItem => {
        const product = allProducts.find(p => p.uniqueID === cartItem.uniqueID);
        return {
          ...cartItem,
          name: product ? product.name : 'Producto no encontrado',
          url: product ? product.url : '#',
          image: product ? product.image : '',
          price: product ? product.price : 0
        };
      });

      setCartItems(detailedItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleRemoveItem = async (uniqueID, size) => {
    try {
      const res = await fetch('/api/cart/removeItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueID, size })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'No se pudo eliminar el producto del carrito.');
      }

      // Vuelve a actualizar el carrito
      await fetchCartData();
    } catch (err) {
      console.error('Error al eliminar el producto del carrito:', err);
      setError(err.message);
    }
  };

  return (
    <>
      <Header position="relative" textColor="text-black" />
      <div className="cart-page mx-auto pt-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              // Skeleton mientras se cargan los productos (igual que antes, sin cambios)
              <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                <div className="space-y-4">
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
              // Skeleton de OrderSummary (igual, sin cambios)
              <section className="order-summary bg-[#1c1f28] text-white rounded-lg shadow-md p-6">
                <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>
                <div className="mb-4">
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                </div>
                <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
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
