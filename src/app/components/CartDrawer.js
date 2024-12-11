// src/components/CartDrawer.js
'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]); // Cart items from localStorage
  const [products, setProducts] = useState([]);   // Detailed product data from API
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null);     // Estado de error

  useEffect(() => {
    if (isOpen) {
      const fetchCartProducts = async () => {
        setLoading(true);
        setError(null);

        try {
          // Obtener los elementos del carrito desde localStorage
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          setCartItems(cart);

          if (cart.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
          }

          // Extraer los uniqueIDs
          const uniqueIDs = cart.map(item => item.uniqueID);

          // Firestore limita "in" a 10 elementos, así que dividimos la lista en chunks de 10
          const chunks = [];
          for (let i = 0; i < uniqueIDs.length; i += 10) {
            chunks.push(uniqueIDs.slice(i, i + 10));
          }

          const allProducts = [];

          for (const chunk of chunks) {
            const response = await fetch('/api/shoppingCart/public/get/cartIds', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ productIDs: chunk }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Error al obtener productos del carrito.');
            }

            const data = await response.json();
            allProducts.push(...data.products);
          }

          setProducts(allProducts);
        } catch (err) {
          console.error('Error al obtener productos del carrito:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCartProducts();

      const handleClickOutside = (event) => {
        if (event.target.closest(".cart-drawer") === null) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  const subtotal = detailedCartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  const shippingThreshold = 255;
  const shippingProgress = (subtotal >= shippingThreshold ? 100 : (subtotal / shippingThreshold) * 100);
  const shippingFee = subtotal >= shippingThreshold ? 0 : 9.99;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="cart-drawer relative bg-white w-full sm:w-3/4 md:w-2/3 lg:w-1/3 p-6 overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800 transition-colors duration-300"
          aria-label="Cerrar carrito"
        >
          ❌
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Tu carrito</h2>

        {loading ? (
          // Skeleton mientras se cargan los productos
          <div>
            {/* Skeleton para el progreso de envío */}
            <div className="mb-4">
              <div className="h-2 bg-gray-300 rounded-full animate-pulse mt-1"></div>
              <div className="h-2 bg-gray-300 rounded-full animate-pulse mt-1"></div>
            </div>

            {/* Skeleton para los productos */}
            <div className="space-y-4">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-md animate-pulse"></div>
                    <div>
                      <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-2"></div>
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

            {/* Skeleton para el subtotal */}
            <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse mb-6"></div>

            {/* Skeleton para los botones */}
            <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
            <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : detailedCartItems.length === 0 ? (
          <p className="text-gray-700">Tu carrito está vacío</p>
        ) : (
          <>
            {/* Shipping Progress */}
            <div className="mb-4">
              <div className="flex justify-between">
                {subtotal < shippingThreshold ? (
                  <>
                    <span className="text-sm text-gray-600">
                      ${Math.abs(shippingThreshold - subtotal).toFixed(2)} away from free delivery
                    </span>
                    <span className="text-sm text-gray-600">
                      ${(shippingThreshold - subtotal).toFixed(2)} for free shipping
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-600">¡Tienes envío gratuito!</span>
                )}
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${shippingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-4">
              {detailedCartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Tamaño: {item.size}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-lg text-gray-800">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between mt-4 font-semibold text-lg text-gray-800">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Shipping Fee */}
            <div className="flex justify-between mt-2 font-semibold text-lg text-gray-800">
              <span>Envío</span>
              <span>${shippingFee.toFixed(2)}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between mt-2 font-bold text-xl text-gray-900">
              <span>Total</span>
              <span>${(subtotal + shippingFee).toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              <Link href="/checkout">
                <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors duration-300">
                  Checkout
                </button>
              </Link>
              <Link href="/cart">
                <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                  Ver Carrito
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
