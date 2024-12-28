// src/components/CartSummary.js
'use client';
import { useContext, useState } from 'react';
import Link from 'next/link';
import { CartContext } from '@/context/CartContext'; // Importar CartContext
import Image from 'next/image'; // Importar la etiqueta Image

export default function CartSummary() {
  const { cartItems, products, loading, error, addItemToCart, removeItemFromCart } = useContext(CartContext);
  const [isRemoving, setIsRemoving] = useState(null); // Estado para controlar la eliminación del producto
  const [isUpdating, setIsUpdating] = useState(null); // Estado para controlar la actualización de cantidad

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

  const handleRemoveItem = async (uniqueID) => {
    setIsRemoving(uniqueID); // Activamos el estado de "eliminando"
    await removeItemFromCart(uniqueID); // Eliminamos el producto del carrito
    setIsRemoving(null); // Desactivamos el estado de "eliminando"
  };

  const handleAddQuantity = async (item) => {
    setIsUpdating(item.uniqueID); // Activamos el estado de "actualizando"
    await addItemToCart({ uniqueID: item.uniqueID, qty: 1 }, false); // Pasar delta +1
    setIsUpdating(null); // Desactivamos el estado de "actualizando"
  };

  const handleRemoveQuantity = async (item) => {
    if (item.qty > 1) {
      setIsUpdating(item.uniqueID); // Activamos el estado de "actualizando"
      await addItemToCart({ uniqueID: item.uniqueID, qty: -1 }, false); // Pasar delta -1
      setIsUpdating(null); // Desactivamos el estado de "actualizando"
    } else {
      // Si la cantidad es 1, eliminar el producto del carrito
      handleRemoveItem(item.uniqueID);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg w-full text-[#1c1f28]">
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
                    <p className="font-semibold">{item.name}</p>
                  </div>
                </div>
                {/* Controles de Cantidad y Eliminar */}
                <div className="flex items-center space-x-4">
                  {/* Precio */}
                  <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                  {/* Controles de Cantidad */}
                  <div className="flex items-center space-x-2">
                    {/* Botón para disminuir cantidad */}
                    <button
                      onClick={() => handleRemoveQuantity(item)} // Llamar a la función para reducir la cantidad
                      className={`px-2 py-1 text-sm bg-transparent text-gray-700 hover:text-black transition-colors duration-200 ${
                        item.qty === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      disabled={item.qty === 1 || isUpdating === item.uniqueID} // Desactivar si qty es 1
                      aria-label={`Disminuir cantidad de ${item.name}`}
                    >
                      -
                    </button>
                    {/* Cantidad */}
                    <p className="text-sm text-gray-500">{item.qty}</p>
                    {/* Botón para aumentar cantidad */}
                    <button
                      onClick={() => handleAddQuantity(item)} // Llamar a la función para aumentar la cantidad
                      className={`px-2 py-1 text-sm bg-transparent text-gray-700 hover:text-black transition-colors duration-200 ${
                        isUpdating === item.uniqueID ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                      disabled={isUpdating === item.uniqueID} // Desactivar si se está actualizando
                      aria-label={`Aumentar cantidad de ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  {/* Botón de Eliminar */}
                  <button
                    onClick={() => handleRemoveItem(item.uniqueID)} // Llamamos a la función de eliminación
                    className="text-red-500 hover:text-red-700 text-sm"
                    disabled={isRemoving === item.uniqueID}
                    aria-label={`Eliminar ${item.name}`}
                  >
                    {isRemoving === item.uniqueID ? 'Eliminando...' : 'Eliminar'}
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
          <div className="mb-6 flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="text-sm">
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
