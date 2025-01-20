'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';

// Componentes creados:
import FreeShippingProgress from './FreeShippingProgress';
import CartItemsList from './CartItemsList';
import ShippingOptions from './ShippingOptions';
import CartSummary from './CartSummary';
import ActionButtons from './ActionButtons';

// Modales
import ShippingAddressModal from '../shippingAddressModal/ShippingAddressModal.js.js';
import ZipCodeModal from './ZipCodeModal';

export default function CartDrawer({ isOpen, onClose }) {
  // Contextos
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
  

  // Estados locales
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

  // Calcular items detallados
  const detailedCartItems = cartItems.map((cartItem) => {
    const product = products.find((p) => p.uniqueID === cartItem.uniqueID);
    return {
      ...cartItem,
      name: product ? product.name : 'Producto no encontrado',
      url: product ? product.url : '#',
      image: product ? product.image : '',
      price: product ? product.price : 0,
    };
  });

  // Calcular subtotal
  const subtotal = detailedCartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // Umbral de envío gratis
  const shippingThreshold = 999;

  // Si ya aplica envío gratis, shippingFee = 0; si no, se toma de la cotización elegida
  const shippingFee =
    subtotal >= shippingThreshold
      ? 0
      : selectedQuote
      ? parseFloat(selectedQuote.total_price)
      : 0;

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
              <FreeShippingProgress
                subtotal={subtotal}
                shippingThreshold={shippingThreshold}
              />

              {/* Lista de productos */}
              <CartItemsList
                items={detailedCartItems}
                isRemoving={isRemoving}
                isUpdating={isUpdating}
                handleRemove={handleRemove}
                handleRemoveQuantity={handleRemoveQuantity}
                handleAddQuantity={handleAddQuantity}
              />

              {/* Opciones de Envío */}
              <ShippingOptions
                subtotal={subtotal}
                shippingThreshold={shippingThreshold}
                shippingQuotes={shippingQuotes}
                selectedQuote={selectedQuote}
                loadingShipping={loadingShipping}
                shippingError={shippingError}
                currentUser={currentUser}
                shippingAddress={shippingAddress}
                guestZipCode={guestZipCode}
                onSelectQuote={handleSelectQuote}
                onEditAddress={handleEditShippingAddress}
                onEditGuestZip={handleEditGuestZip}
              />

              {/* Resumen del carrito: Subtotal / Total */}
              <CartSummary
                subtotal={subtotal}
                shippingFee={shippingFee}
                total={total}
                shippingThreshold={shippingThreshold}
                selectedQuote={selectedQuote}
              />

              {/* Botones de acción */}
              <ActionButtons />
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
