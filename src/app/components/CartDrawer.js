// src/components/CartDrawer.js
'use client';

import { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import ShippingAddressModal from "./ShippingAddressModal";
import ZipCodeModal from "./ZipCodeModal";
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cartItems,
    products,
    loading,
    error,
    removeItemFromCart,
    addItemToCart,
    shippingAddress,
    fetchShippingQuotes,
    shippingQuotes,
    selectedQuote,
    setSelectedQuote,
    loadingShipping,
    shippingError,
    guestZipCode,
  } = useContext(CartContext);

  const { currentUser } = useContext(AuthContext);

  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);
  const [visible, setVisible] = useState(isOpen);
  const [animation, setAnimation] = useState('');
  const drawerRef = useRef(null);

  // Modal de dirección (usuario autenticado)
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Modal de CP (usuario invitado)
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  // -- Animación de apertura/cierre del Drawer --
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimation('animate-slideIn');
    } else if (visible) {
      setAnimation('animate-slideOut');
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  // -- Cerrar Drawer al hacer click fuera (si no hay otro modal abierto) --
  useEffect(() => {
    if (!visible) return;
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        if (!isModalOpen && !isZipModalOpen) {
          onClose();
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [visible, isModalOpen, isZipModalOpen, onClose]);

  // -- Recalcular envío automáticamente al abrir el Drawer
  //    (si ya hay dirección Auth o CP invitado) --
  useEffect(() => {
    if (!isOpen) return; // Drawer cerrado, no hacemos nada
    if (!loadingShipping && shippingQuotes.length === 0) {
      if (currentUser && shippingAddress) {
        fetchShippingQuotes();
      } else if (!currentUser && guestZipCode) {
        fetchShippingQuotes();
      }
    }
  }, [
    isOpen,
    currentUser,
    shippingAddress,
    guestZipCode,
    shippingQuotes.length,
    loadingShipping,
    fetchShippingQuotes,
  ]);

  if (!visible) return null;

  // Calcular subtotal
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

  // Si ya aplica envío gratis, shippingFee = 0; si no, se toma de la cotización elegida
  const shippingFee = subtotal >= shippingThreshold
    ? 0
    : (selectedQuote ? parseFloat(selectedQuote.total_price) : 0);

  const total = subtotal + shippingFee;

  // Handlers de cantidad
  const handleRemove = async (uniqueID) => {
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
      handleRemove(item.uniqueID);
    }
  };

  // Elegir cotización
  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    toast.success(
      `Has seleccionado ${quote.carrier} - ${quote.service} por $${parseFloat(quote.total_price).toFixed(2)}`
    );
  };

  // Editar dirección (Auth)
  const handleEditShippingAddress = () => {
    setIsModalOpen(true);
  };

  // Editar CP (Guest)
  const handleEditGuestZip = () => {
    setIsZipModalOpen(true);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          ref={drawerRef}
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
            <div>Cargando productos...</div>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : detailedCartItems.length === 0 ? (
            <p className="text-gray-700">Tu carrito está vacío</p>
          ) : (
            <>
              {/* Barra de Progreso para envío gratis */}
              <div className="mb-4">
                <div className="flex justify-between">
                  {subtotal < shippingThreshold ? (
                    <>
                      <span className="text-sm text-gray-600">
                        ${Math.abs(shippingThreshold - subtotal).toFixed(2)} para envío gratis
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

              {/* Lista de productos */}
              <div className="space-y-4">
                {detailedCartItems.map((item) => (
                  <div key={item.uniqueID} className="flex justify-between items-center">
                    <div className="flex items-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="object-cover rounded-md mr-4"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded-md mr-4"></div>
                      )}
                      <div>
                        <Link href={`/product/${item.url}`}>
                          <p className="font-semibold text-gray-800 hover:underline">
                            {item.name}
                          </p>
                        </Link>
                        <p className="text-sm text-gray-600">
                          Cantidad:
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
                          <span className="text-sm text-gray-500 mx-2">{item.qty}</span>
                          <button
                            onClick={() => handleAddQuantity(item)}
                            className={`px-2 py-1 text-sm bg-transparent text-gray-700 hover:text-black transition-colors duration-200 ${
                              isUpdating === item.uniqueID ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                            disabled={isUpdating === item.uniqueID}
                            aria-label={`Aumentar cantidad de ${item.name}`}
                          >
                            +
                          </button>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-lg text-gray-800">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.uniqueID)}
                        className="text-red-500 hover:text-red-700 mt-2 text-sm flex items-center"
                        disabled={isRemoving === item.uniqueID}
                        aria-label={`Eliminar ${item.name}`}
                      >
                        {isRemoving === item.uniqueID
                          ? 'Eliminando...'
                          : (
                            <>
                              <FaTrash className="mr-1" /> Eliminar
                            </>
                          )
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sección de Envío */}
              <div className="mt-6">
                {subtotal >= shippingThreshold ? (
                  <div className="flex justify-between items-center bg-green-100 p-4 rounded-md">
                    <span className="font-semibold text-green-700">¡Envío Gratis!</span>
                  </div>
                ) : (
                  <>
                    {/* Mensajes de estado de la cotización */}
                    {loadingShipping && (
                      <p className="text-gray-600 mt-4">Calculando envío...</p>
                    )}
                    {shippingError && (
                      <p className="text-red-500 mt-4">Error: {shippingError}</p>
                    )}

                    {/* Mostrar cotizaciones si existen */}
                    {shippingQuotes.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Opciones de Envío</h3>
                        <div className="space-y-2">
                          {shippingQuotes.map((quote, index) => (
                            <div key={quote.id || index} className="flex items-center p-2 border rounded">
                              <input
                                type="radio"
                                id={`quote-${index}`}
                                name="shippingQuote"
                                value={quote.id}
                                checked={selectedQuote && selectedQuote.id === quote.id}
                                onChange={() => handleSelectQuote(quote)}
                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <label htmlFor={`quote-${index}`} className="flex flex-col">
                                <span className="font-semibold">
                                  {quote.carrier} - {quote.service}
                                </span>
                                <span className="text-gray-600">
                                  Precio: ${parseFloat(quote.total_price).toFixed(2)}
                                </span>
                                <span className="text-gray-600">
                                  Días estimados: {quote.days}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Editar dirección (Auth) o CP (guest) */}
                    <div className="mt-4">
                      {currentUser && shippingAddress && (
                        <button
                          onClick={handleEditShippingAddress}
                          className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
                        >
                          Editar Dirección de Envío
                        </button>
                      )}

                      {!currentUser && guestZipCode && (
                        <button
                          onClick={handleEditGuestZip}
                          className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300"
                        >
                          Editar CP (Actualmente: {guestZipCode})
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Subtotal */}
              <div className="flex justify-between mt-4 font-semibold text-lg text-gray-800">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Envío si no es gratis y tenemos cotización seleccionada */}
              {subtotal < shippingThreshold && selectedQuote && (
                <div className="flex justify-between mt-2 font-semibold text-lg text-gray-800">
                  <span>Envío</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between mt-2 font-bold text-xl text-gray-900">
                <span>Total</span>
                <span>
                  ${total.toFixed(2)}
                  {subtotal < shippingThreshold && !selectedQuote && ' (+ Envío)'}
                </span>
              </div>

              {/* Botones de acción */}
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

      {/* Modal para Dirección (usuario autenticado) */}
      <ShippingAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Modal para CP (invitado) */}
      <ZipCodeModal
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
      />
    </>
  );
}
