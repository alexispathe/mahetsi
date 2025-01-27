// src/cart/CartPage.js
'use client';

import { useContext, useState, useEffect } from 'react';
import OrderSummary from './OrderSummary';
import CartItems from './CartItems';
import { CartContext } from '@/context/CartContext/CartContext';
import { AuthContext } from '@/context/AuthContext';

import ShippingAddressModal from '../components/shippingAddressModal/ShippingAddressModal.js';
import ZipCodeModal from '../components/cartDrawer/ZipCodeModal';
import { toast } from 'react-toastify';

/** Importamos nuestro nuevo componente de envío */
import ShippingOptions from '../components/ShippingOptions'; // Ajusta la ruta a la carpeta donde guardaste ShippingOptions.jsx

export default function CartPage() {
  const {
    cartItems,
    products,
    loading,          // Carga del carrito
    error,
    removeItemFromCart,
    addItemToCart,

    // Envío
    shippingAddress,
    shippingQuotes,
    fetchShippingQuotes,
    selectedQuote,
    setSelectedQuote,
    loadingShipping,  // Carga de cotizaciones
    shippingError,
    guestZipCode,
  } = useContext(CartContext);

  const { currentUser } = useContext(AuthContext);

  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdatingQty, setIsUpdatingQty] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  // Unir detalles del producto con el carrito
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

  // Subtotal
  const subtotal = detailedCartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Threshold y Fee de envío
  const shippingThreshold = 999;
  const shippingFee =
    subtotal >= shippingThreshold
      ? 0
      : selectedQuote
      ? parseFloat(selectedQuote.total_price)
      : 0;

  const grandTotal = subtotal + shippingFee;

  // Determinar si shipping está pendiente
  const isShippingPending =
    subtotal < shippingThreshold &&
    ((currentUser && !shippingAddress) || (!currentUser && !guestZipCode));

  // Llamar a fetchShippingQuotes si no está cargando y aún no tenemos shippingQuotes
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
    fetchShippingQuotes,
  ]);

  // Handlers de cantidad
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

  // Selección de cotización
  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
  };

  // Abrir/Cerrar modales
  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  const openZipModal = () => setIsZipModalOpen(true);
  const closeZipModal = () => setIsZipModalOpen(false);

  return (
    <>
      <div className="cart-page mx-auto pt-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================== Columna principal: Lista de Carrito ================== */}
          <div className="lg:col-span-2">
            {loading ? (
              // Skeleton de carga para "Tu carrito"
              <section className="py-8 px-6 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center mb-4"
                      >
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

          {/* ================== Columna derecha: Cotización de envío + Resumen ================== */}
          <div className="space-y-6">
            {/* ------ 1) Sección de Cotización de Envío ------ */}
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
                    <span className="text-sm text-gray-600">
                      ¡Felicidades! Tu envío es gratis.
                    </span>
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
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Usamos el nuevo componente para las opciones de envío */}
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
                onEditAddress={openAddressModal}
                onEditGuestZip={openZipModal}
              />
            </section>

            {/* ------ 2) Resumen del Pedido ------ */}
            <OrderSummary
              loading={loading}
              loadingShipping={loadingShipping}
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
