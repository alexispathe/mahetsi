// src/components/CartSummary.js
'use client';
import { useContext } from 'react';
import Link from 'next/link';
import '../styles/cartSummary.css';
import { CartContext } from '@/context/CartContext'; // Importar CartContext
import Image from 'next/image'; // Importar la etiqueta Image

export default function CartSummary() {
  const { cartItems, products, loading, error, removeItemFromCart } = useContext(CartContext);

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
  const salesTax = 45.89; // Puedes ajustar esto según tu lógica
  const grandTotal = subtotal + shipping + salesTax;

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
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96} // Ancho de la imagen
                      height={96} // Alto de la imagen
                      className="object-cover rounded-md mr-4"
                    />
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
                    onClick={() => removeItemFromCart(item.uniqueID, item.size)}
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
              <p className="font-semibold">
                ${grandTotal.toFixed(2)} <span className="text-xs">(Incluye ${salesTax.toFixed(2)} impuestos)</span>
              </p>
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
