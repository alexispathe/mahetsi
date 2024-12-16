// src/cart/page.js

'use client'
import { useState, useEffect, useContext } from 'react';
import '../styles/cartSummary.css';
import Header from '../components/Header';
import OrderSummary from './OrderSummary';
import CartItems from './CartItems';
import { AuthContext } from '@/context/AuthContext'; // Importar AuthContext
import { getLocalCart, clearLocalCart, removeFromLocalCart } from '@/app/utils/cartLocalStorage'; // Importar utilidades

export default function CartPage() {
  const { currentUser } = useContext(AuthContext); // Obtener el usuario actual desde AuthContext
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentUser) {
        // Usuario autenticado: obtener ítems desde la API
        const res = await fetch('/api/cart/getItems', {
          method: 'GET',
          credentials: 'include', // Incluir credenciales para enviar cookies
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError('Debes iniciar sesión para ver el carrito.');
            setCartItems([]);
            setLoading(false);
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

        // Extraer los uniqueIDs para obtener los detalles de los productos
        const uniqueIDs = firestoreItems.map(i => i.uniqueID);

        // Llamar a la API para obtener detalles de productos
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
      } else {
        // Usuario no autenticado: obtener ítems desde localStorage
        const localCart = getLocalCart(); // Obtener carrito local

        if (localCart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Extraer los uniqueIDs para obtener los detalles de los productos
        const uniqueIDs = localCart.map(i => i.uniqueID);

        // Llamar a la API para obtener detalles de productos
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

        const detailedItems = localCart.map(cartItem => {
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
      }
    } catch (err) {
      console.error('Error al obtener productos del carrito:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [currentUser]); // Ejecutar cada vez que cambie currentUser

  const handleRemoveItem = async (uniqueID, size) => {
    try {
      if (currentUser) {
        // Usuario autenticado: eliminar ítem desde la API
        const res = await fetch('/api/cart/removeItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Incluir credenciales para enviar cookies
          body: JSON.stringify({ uniqueID, size })
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'No se pudo eliminar el producto del carrito.');
        }

        // Volver a obtener el carrito después de eliminar
        await fetchCartData();
      } else {
        // Usuario no autenticado: eliminar ítem desde localStorage
        removeFromLocalCart(uniqueID, size); // Función para eliminar del localStorage
        // Volver a obtener el carrito después de eliminar
        fetchCartData();
      }
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
              // Skeleton mientras se cargan los productos
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
              // Skeleton de OrderSummary
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
