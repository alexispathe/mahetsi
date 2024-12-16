// src/components/CartSummary.js

'use client'
import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import '../styles/cartSummary.css';
import { AuthContext } from '@/context/AuthContext'; // Importar AuthContext
import { getLocalCart, clearLocalCart, removeFromLocalCart } from '@/app/utils/cartLocalStorage'; // Importar utilidades

export default function CartSummary() {
  const { currentUser } = useContext(AuthContext); // Obtener el usuario actual desde AuthContext
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
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
            setProducts([]);
            setLoading(false);
            return;
          }
          const data = await res.json();
          throw new Error(data.error || 'Error al obtener el carrito');
        }

        const data = await res.json();
        const firestoreItems = data.cartItems; // [{ uniqueID, size, qty }, ...]

        if (firestoreItems.length === 0) {
          // Carrito vacío
          setCartItems([]);
          setProducts([]);
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

        setCartItems(firestoreItems);
        setProducts(allProducts);
      } else {
        // Usuario no autenticado: obtener ítems desde localStorage
        const localCart = getLocalCart(); // Obtener carrito local

        if (localCart.length === 0) {
          setCartItems([]);
          setProducts([]);
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

        setCartItems(localCart);
        setProducts(allProducts);
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

  // Combinar los detalles del producto con el carrito
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

  // Calcular subtotal desde los ítems del carrito
  const subtotal = detailedCartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal >= 255 ? 0 : 9.99;
  const salesTax = 45.89;
  const grandTotal = subtotal + shipping + salesTax;

  // Función para eliminar un producto del carrito
  const handleRemoveFromCart = async (uniqueID, size) => {
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
    <section className="cart-summary bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>

      {loading ? (
        // Skeleton mientras se cargan los productos
        <div>
          {/* Skeleton de los productos */}
          <div className="space-y-4 mb-6">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-md animate-pulse mr-4"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton del resumen de la orden */}
          <div className="space-y-4 mb-6">
            <div className="w-full h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
            <div className="w-full h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
            <div className="w-full h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
          </div>

          {/* Skeleton del formulario */}
          <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
          <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
          <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 mb-6">Error: {error}</p>
      ) : detailedCartItems.length === 0 ? (
        <p className="text-gray-700 mb-6">Tu carrito está vacío</p>
      ) : (
        <>
          {/* List of items */}
          <div className="mb-6">
            {detailedCartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-md mr-4"></div>
                  )}
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{item.qty} @ ${item.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.uniqueID, item.size)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
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
              <p className="text-sm">Envío</p>
              <p className="font-semibold">${shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm">Total</p>
              <p className="font-semibold">${grandTotal.toFixed(2)} <span className="text-xs">(Incluye ${salesTax.toFixed(2)} impuestos)</span></p>
            </div>
          </div>

          {/* Coupon code input */}
          <div className="mb-6">
            <label className="block text-sm mb-2">Ingresa tu código de cupón</label>
            <div className="flex">
              <input 
                type="text" 
                className="w-full p-3 text-black rounded-md border border-gray-300"
                placeholder="Código de cupón"
              />
              <button className="bg-orange-500 text-white py-3 px-6 rounded-md ml-4 hover:bg-orange-600">
                Aplicar
              </button>
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="mb-6">
            <label className="text-sm flex items-center">
              <input type="checkbox" className="mr-2" />
              Acepto los <a href="#" className="text-blue-400">términos y condiciones</a> de Alpines
            </label>
          </div>

          {/* Complete order button */}
          <div>
            <Link href="/checkout">
              <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600">
                Completar Pedido
              </button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
