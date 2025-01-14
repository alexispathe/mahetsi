// src/components/CartDrawer.js
'use client';

import { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CartContext } from "@/context/CartContext"; // Importar el contexto del carrito
import Image from "next/image"; // Importar la etiqueta Image

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, products, loading, error, removeItemFromCart, addItemToCart } = useContext(CartContext);
  const [isRemoving, setIsRemoving] = useState(null); // Estado para controlar la eliminación del producto
  const [isUpdating, setIsUpdating] = useState(null); // Estado para controlar la actualización de cantidad
  const [visible, setVisible] = useState(isOpen); // Controla la visibilidad del Drawer
  const [animation, setAnimation] = useState(''); // Controla la animación actual
  const drawerRef = useRef(null); // Referencia para el contenedor del CartDrawer

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimation('animate-slideIn');
    } else if (visible) {
      setAnimation('animate-slideOut');
      // Espera a que termine la animación antes de ocultar el drawer
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000); // 2000ms = 2 segundos

      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  // Cerrar el CartDrawer cuando se hace clic fuera de él
  useEffect(() => {
    if (!visible) return;
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose(); // Cerrar el drawer si se hace clic fuera
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el listener cuando el componente se desmonta o se cierra el CartDrawer
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

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
  const shippingThreshold = 699;
  const shippingProgress = (subtotal >= shippingThreshold ? 100 : (subtotal / shippingThreshold) * 100);
  const shippingFee = subtotal >= shippingThreshold ? 0 : 9.99;

  // Función para manejar la eliminación del producto
  const handleRemove = async (uniqueID) => {
    setIsRemoving(uniqueID);
    await removeItemFromCart(uniqueID);
    setIsRemoving(null);
  };

  // Función para manejar el aumento de cantidad
  const handleAddQuantity = async (item) => {
    setIsUpdating(item.uniqueID);
    await addItemToCart({ uniqueID: item.uniqueID, qty: 1 }, false); // Pasar delta +1
    setIsUpdating(null);
  };

  // Función para manejar la disminución de cantidad
  const handleRemoveQuantity = async (item) => {
    if (item.qty > 1) {
      setIsUpdating(item.uniqueID);
      await addItemToCart({ uniqueID: item.uniqueID, qty: -1 }, false); // Pasar delta -1
      setIsUpdating(null);
    } else {
      // Si la cantidad es 1, eliminar el producto del carrito
      handleRemove(item.uniqueID);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 transition-opacity duration-2000 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div
        ref={drawerRef} // Asignar la referencia al contenedor del CartDrawer
        className={`relative bg-white w-full sm:w-3/4 md:w-2/3 lg:w-1/3 p-6 overflow-y-auto rounded-xl shadow-lg text-[#1c1f28] ${animation}`}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800 transition-colors duration-300"
          aria-label="Cerrar carrito"
        >
          ❌
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>

        {loading ? (
          // Skeleton mientras se cargan los productos
          <div>
            {/* Skeleton para el progreso de envío */}
            <div className="mb-4">
              <div className="flex justify-between">
                {subtotal < shippingThreshold ? (
                  <>
                    <span className="text-sm text-gray-600">
                      ${Math.abs(shippingThreshold - subtotal).toFixed(2)} away from free delivery
                    </span>
                    <span className="text-sm text-gray-600">
                      ${(shippingThreshold - subtotal).toFixed(2)} para envío gratis
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
                      ${(shippingThreshold - subtotal).toFixed(2)} para envío gratis
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
              {detailedCartItems.map((item) => (
                <div key={item.uniqueID} className="flex justify-between items-center">
                  {/* Información del Producto */}
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
                      <Link href={`/product/${item.url}`}>
                        <p className="font-semibold text-gray-800 hover:underline">{item.name}</p>
                      </Link>
                      <p className="text-sm text-gray-600">Cantidad: {/* Botón para disminuir cantidad */}
                        <button
                          onClick={() => handleRemoveQuantity(item)}
                          className={`px-2 py-1 text-sm bg-transparent text-gray-700 hover:text-black transition-colors duration-200 ${
                            item.qty === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          disabled={item.qty === 1 || isUpdating === item.uniqueID}
                          aria-label={`Disminuir cantidad de ${item.name}`}
                        >
                          -
                        </button>
                        {/* Cantidad */}
                        <span className="text-sm text-gray-500">{item.qty}</span>
                        {/* Botón para aumentar cantidad */}
                        <button
                          onClick={() => handleAddQuantity(item)}
                          className={`px-2 py-1 text-sm bg-transparent text-gray-700 hover:text-black transition-colors duration-200 ${
                            isUpdating === item.uniqueID ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                          disabled={isUpdating === item.uniqueID}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                        >
                          +
                        </button></p>
                      {/* Controles de Cantidad */}
                    </div>
                  </div>
                  {/* Controles de Precio y Eliminar */}
                  <div className="flex flex-col items-end">
                    {/* Precio */}
                    <span className="font-semibold text-lg text-gray-800">${(item.price * item.qty).toFixed(2)}</span>
                    {/* Botón de Eliminar */}
                    <button
                      onClick={() => handleRemove(item.uniqueID)}
                      className="text-red-500 hover:text-red-700 mt-2 text-sm"
                      disabled={isRemoving === item.uniqueID}
                      aria-label={`Eliminar ${item.name}`}
                    >
                      {isRemoving === item.uniqueID ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
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
                  Pagar
                </button>
              </Link>
              <Link href="/cart">
                <button className="w-full bg-gray-200 text-gray-700 mt-4 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300">
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
