// src/cart/page.js
'use client';
import { useContext, useState, useEffect } from 'react';
import Header from '../components/header/Header';
import OrderSummary from './OrderSummary';
import CartItems from './CartItems';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';

// IMPORTAMOS los mismos modales usados en el Drawer
import ShippingAddressModal from '../components/ShippingAddressModal';
import ZipCodeModal from '../components/ZipCodeModal';

export default function CartPage() {
  // ====== 1) Estado global (contextos) ======
  const {
    cartItems,
    products,
    loading,
    error,
    removeItemFromCart,
    addItemToCart,
    shippingAddress,
    shippingQuotes,
    fetchShippingQuotes,
    selectedQuote,
    setSelectedQuote,
    loadingShipping,
    shippingError,
    guestZipCode,
  } = useContext(CartContext);

  const { currentUser } = useContext(AuthContext);

  // ====== 2) Estados locales para spinners y modales ======
  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdatingQty, setIsUpdatingQty] = useState(null);

  // Modales
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  // ====== 3) Unir detalles del producto con ítems del carrito ======
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

  // ====== 4) Calcular subtotal ======
  const subtotal = detailedCartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // ====== 5) Lógica de envío ======
  const shippingThreshold = 699;
  const shippingFee = subtotal >= shippingThreshold
    ? 0
    : (selectedQuote ? parseFloat(selectedQuote.total_price) : 0);

  const grandTotal = subtotal + shippingFee;

  // ====== 6) useEffect para cargar cotizaciones (similar al Drawer) ======
  useEffect(() => {
    if (!loadingShipping && shippingQuotes.length === 0) {
      // Si no estamos cargando cotizaciones y aún no tenemos ninguna
      if (currentUser && shippingAddress) {
        // Usuario Auth + Dirección
        fetchShippingQuotes();
      } else if (!currentUser && guestZipCode) {
        // Invitado + CP
        fetchShippingQuotes();
      }
    }
  }, [
    currentUser,
    shippingAddress,
    guestZipCode,
    shippingQuotes.length,
    loadingShipping,
    fetchShippingQuotes,
  ]);

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
    // Podrías mostrar un toast: "Has seleccionado X por Y"
  };

  // ====== 9) Abrir/cerrar modales para dirección o CP ======
  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  const openZipModal = () => setIsZipModalOpen(true);
  const closeZipModal = () => setIsZipModalOpen(false);

  return (
    <>
      <Header position="relative" textColor="text-black" />

      <div className="cart-page mx-auto pt-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* =========================== 1) Lista de Carrito ======================= */}
          <div className="lg:col-span-2">
            {loading ? (
              // === Skeleton mientras se cargan los productos ===
              <section className="py-8 px-6 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                {/* Aquí metes placeholders... */}
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

          {/* =========================== 2) Resumen + cotización =================== */}
          <div>
            {loading ? (
              // === Skeleton de OrderSummary ===
              <section className="bg-[#1c1f28] text-white rounded-xl shadow-lg p-6">
                <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>
                {/* placeholders */}
              </section>
            ) : (
              <>
                {/* Mensajes de error de cotización o loading */}
                {shippingError && (
                  <p className="text-red-500 mb-2">Error en envío: {shippingError}</p>
                )}
                {loadingShipping && (
                  <p className="text-gray-700 mb-2">Calculando cotizaciones de envío...</p>
                )}

                <OrderSummary
                  subtotal={subtotal}
                  shippingFee={shippingFee}
                  grandTotal={grandTotal}
                />

                {/* ======= Si NO aplica envío gratis, mostrar opciones de envío ======= */}
                {subtotal < shippingThreshold && (
                  <div className="mt-4 bg-white p-4 rounded shadow text-[#1c1f28] space-y-4">
                    {/* 1) Si NO hay cotizaciones y no hay CP/dirección, 
                           mostramos botones para "Agregar CP" o "Agregar Dirección" */}
                    {!currentUser && !guestZipCode && (
                      <button
                        onClick={openZipModal}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                      >
                        Agregar Código Postal
                      </button>
                    )}

                    {currentUser && !shippingAddress && (
                      <button
                        onClick={openAddressModal}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                      >
                        Agregar Dirección de Envío
                      </button>
                    )}

                    {/* 2) Si ya tenemos cotizaciones, listarlas */}
                    {shippingQuotes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Opciones de Envío</h3>
                        {shippingQuotes.map((quote, index) => (
                          <label
                            key={index}
                            className="flex items-center space-x-2 mb-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="shippingQuote"
                              value={quote.id}
                              checked={selectedQuote && selectedQuote.id === quote.id}
                              onChange={() => handleSelectQuote(quote)}
                            />
                            <span>
                              {quote.carrier} - {quote.service} @ $
                              {parseFloat(quote.total_price).toFixed(2)} / {quote.days} días
                            </span>
                          </label>
                        ))}

                        {/* Botón para Editar CP o Dirección */}
                        <div className="mt-3">
                          {!currentUser && guestZipCode && (
                            <button
                              onClick={openZipModal}
                              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                            >
                              Editar CP (Actualmente: {guestZipCode})
                            </button>
                          )}
                          {currentUser && shippingAddress && (
                            <button
                              onClick={openAddressModal}
                              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                            >
                              Editar Dirección de Envío
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================ 3) Modales de Dirección y CP ================= */}
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
