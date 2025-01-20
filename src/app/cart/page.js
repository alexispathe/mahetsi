'use client';
import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/header/Header';
import OrderSummary from './OrderSummary';
import CartItems from './CartItems';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';

// Reutilizamos los mismos modales usados en el Drawer
import ShippingAddressModal from '../components/shippingAddressModal/ShippingAddressModal.js';
import ZipCodeModal from '../components/cartDrawer/ZipCodeModal';
import { toast } from 'react-toastify'; // Si estás usando react-toastify

export default function CartPage() {
  // ====== Estados globales (contextos) ======
  const {
    cartItems,
    products,
    loading,
    error,
    removeItemFromCart,
    addItemToCart,

    // Envío
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

  // ====== Estados locales para spinner de cantidad y modales ======
  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdatingQty, setIsUpdatingQty] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  // ====== Unir detalles del producto con el carrito ======
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

  // ====== Subtotal ======
  const subtotal = detailedCartItems.reduce(
    (acc, item) => acc + (item.price * item.qty),
    0
  );

  // ====== Threshold y Fee de envío ======
  const shippingThreshold = 999;
  const shippingFee = (subtotal >= shippingThreshold)
    ? 0
    : (selectedQuote ? parseFloat(selectedQuote.total_price) : 0);

  const grandTotal = subtotal + shippingFee;

  // ====== Determinar si shipping está pendiente ======
  const isShippingPending = subtotal < shippingThreshold && (
    (currentUser && !shippingAddress) ||
    (!currentUser && !guestZipCode)
  );

  // ====== useEffect para cargar cotizaciones igual que en CartDrawer ======
  useEffect(() => {
    // Si no hay cotizaciones aún y no estamos en loadingShipping,
    // y hay dirección (Auth) o CP (Guest),
    // entonces llamamos a fetchShippingQuotes().
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
    fetchShippingQuotes,
  ]);

  // ====== Handlers de cantidad ======
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

  // ====== Selección de cotización ======
  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
    toast.success(`Has seleccionado ${quote.carrier} - ${quote.service} por $${parseFloat(quote.total_price).toFixed(2)}`);
  };

  // ====== Abrir/Cerrar modales ======
  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  const openZipModal = () => setIsZipModalOpen(true);
  const closeZipModal = () => setIsZipModalOpen(false);

  return (
    <>
      <Header position="relative" textColor="text-black" />
      <div className="cart-page mx-auto pt-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================== Columna principal: Lista de Carrito ================== */}
          <div className="lg:col-span-2">
            {loading ? (
              // Skeleton de carga
              <section className="py-8 px-6 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                {/* Aquí metes placeholders... */}
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

          {/* ================== Columna derecha: Cotización de envío + Resumen =============== */}
          <div className="space-y-6">
            {/* ------ 1) Sección de Cotización de Envío (como en CartDrawer), ARRIBA ------ */}
            <section className="bg-white rounded shadow p-4 text-[#1c1f28]">
              <h2 className="text-xl font-bold mb-4">Cotización de Envío</h2>

              {/* Barra de progreso para envío gratis */}
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
                    style={{
                      width: `${
                        subtotal >= shippingThreshold
                          ? 100
                          : (subtotal / shippingThreshold) * 100
                      }%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Si subtotal >= threshold => Envío Gratis */}
              {subtotal >= shippingThreshold ? (
                <div className="flex justify-between items-center bg-green-100 p-3 rounded-md">
                  <span className="font-semibold text-green-700">¡Envío Gratis!</span>
                </div>
              ) : (
                <>
                  {/* Mensajes de estado o error */}
                  {loadingShipping && (
                    <p className="text-gray-600 mt-2">Calculando envío...</p>
                  )}
                  {shippingError && (
                    <p className="text-red-500 mt-2">Error: {shippingError}</p>
                  )}

                  {/* Opciones de Envío */}
                  {shippingQuotes.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Opciones de Envío</h3>
                      <div className="space-y-2">
                        {shippingQuotes.map((quote, index) => (
                          <div
                            key={quote.id || index}
                            className="flex items-center p-2 border rounded"
                          >
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

                  {/* Botones para agregar/editar CP o Dirección */}
                  <div className="mt-4 space-y-2">
                    {/* Invitado sin CP => "Agregar CP" */}
                    {!currentUser && !guestZipCode && (
                      <button
                        onClick={openZipModal}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      >
                        Agregar Código Postal
                      </button>
                    )}

                    {/* Invitado con CP => "Editar CP" */}
                    {!currentUser && guestZipCode && (
                      <button
                        onClick={openZipModal}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                      >
                        Editar CP (Actualmente: {guestZipCode})
                      </button>
                    )}

                    {/* Usuario Auth sin dirección => "Agregar dirección" */}
                    {currentUser && !shippingAddress && (
                      <button
                        onClick={openAddressModal}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      >
                        Agregar Dirección de Envío
                      </button>
                    )}

                    {/* Usuario Auth con dirección => "Editar dirección" */}
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

            {/* ------ 2) Ahora sí, Resumen del Pedido DEBAJO ------ */}
            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              grandTotal={grandTotal}
              isShippingPending={isShippingPending}
            />
          </div>
        </div>
      </div>

      {/* ====== Modales para Dirección y CP ====== */}
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
