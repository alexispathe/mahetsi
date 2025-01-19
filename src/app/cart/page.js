// src/cart/page.js
'use client';
import { useContext, useState, useEffect } from 'react';
import Header from '../components/header/Header';
import OrderSummary from './OrderSummary';
import CartItems from './CartItems';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';

// Modales (ya creados)
import ShippingAddressModal from '../components/ShippingAddressModal';
import ZipCodeModal from '../components/ZipCodeModal';

export default function CartPage() {
  // ====== 1) Extraer estado global ======
  const {
    cartItems,
    products,
    loading,
    error,
    removeItemFromCart,
    addItemToCart,
    shippingAddress,
    guestZipCode,
    shippingQuotes,
    fetchShippingQuotes,
    selectedQuote,
    setSelectedQuote,
    loadingShipping,
    shippingError,
  } = useContext(CartContext);

  const { currentUser } = useContext(AuthContext);

  // ====== 2) Estados locales y modales ======
  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdatingQty, setIsUpdatingQty] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  // ====== 3) Productos detallados ======
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

  // ====== 4) Subtotal ======
  const subtotal = detailedCartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // ====== 5) useEffect: Cotizar automático al montar (si hay dirección o CP) ======
  useEffect(() => {
    if (!loadingShipping && shippingQuotes.length === 0) {
      if (currentUser && shippingAddress) {
        fetchShippingQuotes();
      } else if (!currentUser && guestZipCode) {
        fetchShippingQuotes();
      }
    }
  }, [
    currentUser,
    shippingAddress,
    guestZipCode,
    shippingQuotes.length,
    loadingShipping,
    fetchShippingQuotes
  ]);

  // ====== 6) Reglas de envío gratis o cotización ======
  const shippingThreshold = 699;
  const shippingFee = subtotal >= shippingThreshold
    ? 0
    : (selectedQuote ? parseFloat(selectedQuote.total_price) : 0);

  const grandTotal = subtotal + shippingFee;

  // ====== 7) Handlers de cantidad ======
  const handleRemoveItem = async (uniqueID) => {
    setIsRemoving(uniqueID);
    await removeItemFromCart(uniqueID);
    setIsRemoving(null);
  };

  const handleAddQuantity = async (item) => {
    setIsUpdatingQty(item.uniqueID);
    await addItemToCart({ uniqueID: item.uniqueID, qty: 1 }, false);
    setIsUpdatingQty(null);
  };

  const handleRemoveQuantity = async (item) => {
    if (item.qty > 1) {
      setIsUpdatingQty(item.uniqueID);
      await addItemToCart({ uniqueID: item.uniqueID, qty: -1 }, false);
      setIsUpdatingQty(null);
    } else {
      handleRemoveItem(item.uniqueID);
    }
  };

  // ====== 8) Elegir cotización ======
  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    // Puedes mostrar un toast: "Has seleccionado X por $Y"
  };

  // ====== 9) Abrir/cerrar modales ======
  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  const openZipModal = () => setIsZipModalOpen(true);
  const closeZipModal = () => setIsZipModalOpen(false);

  // ====== 10) Render ======
  return (
    <>
      <Header position="relative" textColor="text-black" />
      <div className="cart-page mx-auto pt-20 p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* =================== Columna principal =================== */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ---- Sección del Carrito ---- */}
            {loading ? (
              <section className="py-8 px-6 bg-white shadow-lg rounded-xl text-[#1c1f28]">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                {/* ...Skeleton placeholders... */}
              </section>
            ) : error ? (
              <section className="py-8 px-6 bg-white shadow-lg rounded-xl text-[#1c1f28]">
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

            {/* ---- Sección de Envío (debajo de productos) ---- */}
            <section className="p-6 bg-white shadow-lg rounded-xl text-[#1c1f28]">
              <h2 className="text-2xl font-bold mb-4">Opciones de Envío</h2>

              {subtotal >= shippingThreshold ? (
                /* ----- Envío Gratis ----- */
                <div className="bg-green-100 text-green-800 p-4 rounded">
                  <p className="font-semibold">¡Felicidades! Tienes envío gratis.</p>
                </div>
              ) : (
                /* ----- Se cotiza ----- */
                <>
                  {/* Estado de carga o error de envío */}
                  {loadingShipping && (
                    <p className="text-gray-700 mb-2">Calculando cotizaciones de envío...</p>
                  )}
                  {shippingError && (
                    <p className="text-red-500 mb-2">Error: {shippingError}</p>
                  )}

                  {/* Caso 1: Invitado sin CP */}
                  {!currentUser && !guestZipCode && (
                    <button
                      onClick={openZipModal}
                      className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Agregar tu Código Postal
                    </button>
                  )}

                  {/* Caso 2: Auth sin Dirección */}
                  {currentUser && !shippingAddress && (
                    <button
                      onClick={openAddressModal}
                      className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Agregar Dirección de Envío
                    </button>
                  )}

                  {/* Si tenemos cotizaciones, listarlas */}
                  {shippingQuotes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {shippingQuotes.map((quote, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="shippingQuote"
                            value={quote.id}
                            checked={selectedQuote && selectedQuote.id === quote.id}
                            onChange={() => handleSelectQuote(quote)}
                          />
                          <span className="text-gray-800">
                            {quote.carrier} - {quote.service} - $
                            {parseFloat(quote.total_price).toFixed(2)} / {quote.days} días
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Botones para Editar CP o Dirección existentes */}
                  <div className="mt-4 space-y-2">
                    {!currentUser && guestZipCode && (
                      <button
                        onClick={openZipModal}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                      >
                        Editar CP (Actualmente: {guestZipCode})
                      </button>
                    )}
                    {currentUser && shippingAddress && (
                      <button
                        onClick={openAddressModal}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                      >
                        Editar Dirección de Envío
                      </button>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
          
          {/* =================== Columna lateral (Resumen) =================== */}
          <div>
            {loading ? (
              // Skeleton del OrderSummary
              <section className="bg-[#1c1f28] text-white rounded-xl shadow-lg p-6">
                <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>
                {/* placeholders... */}
              </section>
            ) : (
              <OrderSummary
                subtotal={subtotal}
                shippingFee={shippingFee}
                grandTotal={grandTotal}
              />
            )}
          </div>
        </div>
      </div>

      {/* ========== Modales ========== */}
      <ShippingAddressModal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
      />
      <ZipCodeModal
        isOpen={isZipModalOpen}
        onClose={closeZipModal}
      />
    </>
  );
}
