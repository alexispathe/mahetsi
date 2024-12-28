// src/cart/page.js

'use client';
import { useContext, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import OrderSummary from './OrderSummary';
import CartItems from './CartItems';
import { CartContext } from '@/context/CartContext'; // Importar CartContext

export default function CartPage() {
  const { cartItems, products, loading, error, removeItemFromCart, addItemToCart } = useContext(CartContext);
  const [isRemoving, setIsRemoving] = useState(null); // Estado para controlar la eliminación del producto

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

  // Función para manejar la eliminación del producto
  const handleRemoveItem = async (uniqueID) => {
    setIsRemoving(uniqueID);
    await removeItemFromCart(uniqueID);
    setIsRemoving(null);
  };

  // Función para manejar el aumento de cantidad
  const handleAddQuantity = async (item) => {
    setIsRemoving(item.uniqueID); // Usamos el mismo estado para controlar actualizaciones
    await addItemToCart({ uniqueID: item.uniqueID, qty: 1 }, false);
    setIsRemoving(null);
  };

  // Función para manejar la disminución de cantidad
  const handleRemoveQuantity = async (item) => {
    if (item.qty > 1) {
      setIsRemoving(item.uniqueID); // Usamos el mismo estado para controlar actualizaciones
      await addItemToCart({ uniqueID: item.uniqueID, qty: -1 }, false);
      setIsRemoving(null);
    } else {
      handleRemoveItem(item.uniqueID);
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
              <section className="py-8 px-6 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
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
              <section className="py-8 px-6 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                <p className="text-red-500 mb-6">Error: {error}</p>
              </section>
            ) : (
              <CartItems
                items={detailedCartItems}
                handleRemoveItem={handleRemoveItem}
                handleAddQuantity={handleAddQuantity}
                handleRemoveQuantity={handleRemoveQuantity}
              />
            )}
          </div>
          <div>
            {loading ? (
              // Skeleton de OrderSummary
              <section className="bg-[#1c1f28] text-white rounded-xl shadow-lg p-6">
                <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>
                <div className="mb-4 space-y-2">
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
                <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
                <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
                <div className="w-full h-12 bg-gray-300 rounded-md animate-pulse mb-6"></div>
              </section>
            ) : (
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                salesTax={salesTax}
                grandTotal={grandTotal}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
