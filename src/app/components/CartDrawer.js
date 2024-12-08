'use client'

import { useEffect, useState } from "react";

export default function CartDrawer({ isOpen, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    if (isOpen) {
      // Cargar los productos del carrito desde localStorage cuando se abra
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setProducts(cart);
      
      const handleClickOutside = (event) => {
        if (event.target.closest(".cart-drawer") === null) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      // Simulamos un retraso de 1 segundo para la carga
      setTimeout(() => {
        setLoading(false); // Cambiar el estado de carga después de un segundo
      }, 1000);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = products.reduce((total, product) => total + (product.price * product.qty), 0);
  const shippingThreshold = 255;
  const shippingProgress = (subtotal >= shippingThreshold ? 100 : (subtotal / shippingThreshold) * 100);

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
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart</h2>

        {loading ? (
          // Skeleton para cuando los productos están cargando
          <div className="space-y-4">
            <div className="h-2 bg-gray-200 rounded-full animate-pulse mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full animate-pulse mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full animate-pulse mb-4"></div>
          </div>
        ) : products.length === 0 ? (
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
                  <span className="text-sm text-gray-600">You have free shipping!</span>
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
              {products.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">Size: {product.size}</p>
                      <p className="text-sm text-gray-600">Qty: {product.qty}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-lg text-gray-800">${(product.price * product.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between mt-4 font-semibold text-lg text-gray-800">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              <a href="/checkout">
                <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors duration-300">
                  Checkout
                </button>
              </a>
              <a href="/cart">
                <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                  View Cart
                </button>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
