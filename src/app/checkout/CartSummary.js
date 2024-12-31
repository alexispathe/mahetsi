// src/components/CartSummary.js

'use client';
import { useContext, useState } from 'react';
import Link from 'next/link';
import { CartContext } from '@/context/CartContext'; // Importar CartContext
import Image from 'next/image'; // Importar la etiqueta Image
import TermsModal from './TermsModal'; // Importar el modal de términos y condiciones

export default function CartSummary() {
  const { cartItems, products, loading, error, addItemToCart, removeItemFromCart } = useContext(CartContext);
  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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

  const subtotal = detailedCartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal >= 255 ? 0 : 9.99;
  const salesTax = 45.89;
  const grandTotal = subtotal + shipping + salesTax;

  const handleRemoveItem = async (uniqueID) => {
    setIsRemoving(uniqueID);
    await removeItemFromCart(uniqueID);
    setIsRemoving(null);
  };

  const handleAddQuantity = async (item) => {
    setIsUpdating(item.uniqueID);
    await addItemToCart({ uniqueID: item.uniqueID, qty: 1 }, false);
    setIsUpdating(null);
  };

  const handleRemoveQuantity = async (item) => {
    if (item.qty > 1) {
      setIsUpdating(item.uniqueID);
      await addItemToCart({ uniqueID: item.uniqueID, qty: -1 }, false);
      setIsUpdating(null);
    } else {
      handleRemoveItem(item.uniqueID);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCompleteOrderClick = () => {
    if (!isAccepted) {
      setShowAlert(true);
    }
  };

  const handleCheckboxChange = () => {
    setIsAccepted(!isAccepted);
    if (!isAccepted) {
      setShowAlert(false);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Resumen del Carrito</h2>

      {loading ? (
        // Skeleton loading...
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
          {/* Listado de productos en el carrito */}
          <div className="space-y-6 mb-6">
            {detailedCartItems.map((item) => (
              <div key={item.uniqueID} className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-md shadow-sm">
                {/* Información del Producto */}
                <div className="flex items-center w-full sm:w-2/3">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover rounded-md mr-4 w-24 h-24"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-md mr-4"></div>
                  )}
                  <div>
                    <Link href={`/product/${item.url}`} className="font-semibold text-lg hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Precio unitario: ${item.price.toFixed(2)}</p>
                  </div>
                </div>
                {/* Controles y Precio */}
                <div className="w-full sm:w-1/3 flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-0">
                  {/* Controles de Cantidad y Precio */}
                  <div className="flex items-center space-x-4">
                   
                    {/* Precio Total */}
                    <p className="font-semibold text-xl">${(item.price * item.qty).toFixed(2)}</p>
                     {/* Controles de Cantidad */}
                     <div className="flex items-center space-x-2">
                      {/* Botón para disminuir cantidad */}
                      <button
                        onClick={() => handleRemoveQuantity(item)}
                        className={`px-3 py-1 text-lg bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200 ${
                          item.qty === 1
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        }`}
                        disabled={item.qty === 1 || isUpdating === item.uniqueID}
                        aria-label={`Disminuir cantidad de ${item.name}`}
                      >
                        -
                      </button>
                      {/* Cantidad */}
                      <span className="text-lg">{item.qty}</span>
                      {/* Botón para aumentar cantidad */}
                      <button
                        onClick={() => handleAddQuantity(item)}
                        className={`px-3 py-1 text-lg bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200 ${
                          isUpdating === item.uniqueID ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        }`}
                        disabled={isUpdating === item.uniqueID}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Botón de Eliminar */}
                  <button
                    onClick={() => {
                      setIsRemoving(item.uniqueID);
                      handleRemoveItem(item.uniqueID);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm underline mt-2 sm:mt-0 ml-2"
                    disabled={isRemoving === item.uniqueID}
                    aria-label={`Eliminar ${item.name}`}
                  >
                    {isRemoving === item.uniqueID ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="py-6 px-4 rounded-md bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Resumen del Pedido</h3>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Subtotal</p>
              <p className="font-semibold">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-2">
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

          {/* Términos y condiciones */}
          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={isAccepted}
              onChange={handleCheckboxChange}
            />
            <label className="text-sm">
              Acepto los{' '}
              <button onClick={openModal} className="text-blue-400 hover:underline">
                términos y condiciones
              </button>
            </label>
          </div>

          {/* Alerta de Términos y Condiciones */}
          {showAlert && (
            <div className="text-red-500 mb-4 p-2 bg-red-100 rounded-md">
              Debes aceptar los términos y condiciones antes de completar el pedido.
            </div>
          )}

          {/* Botón para completar pedido */}
          <div className="mt-4">
            <Link href="/checkout">
              <button
                onClick={handleCompleteOrderClick}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition-colors duration-200"
              >
                Completar Pedido
              </button>
            </Link>
          </div>

          {/* Modal de Términos y Condiciones */}
          <TermsModal isOpen={isModalOpen} onClose={closeModal} />
        </>
      )}
    </section>
  );
}
