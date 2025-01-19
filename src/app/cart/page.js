// src/cart/page.js
'use client';
import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/header/Header';
import OrderSummary from './OrderSummary';
import CartItems from './CartItems';
import { CartContext } from '@/context/CartContext'; 
import { AuthContext } from '@/context/AuthContext'; // Si necesitas saber si hay usuario

export default function CartPage() {
  // ====== 1) Extraer estado global de CartContext ======
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
    loadingShipping,
    shippingError,
    guestZipCode,
  } = useContext(CartContext);

  // (Opcional) Para saber si el usuario está autenticado
  const { currentUser } = useContext(AuthContext);

  // ====== 2) Manejo local de estado para "removiendo" (spinner) ======
  const [isRemoving, setIsRemoving] = useState(null);

  // ====== 3) Unir detalles del producto con el carrito ======
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

  // ====== 5) Cotizar envío automático al cargar la página ======
  useEffect(() => {
    // Si no hay cotizaciones y no estamos en loadingShipping,
    // y hay dirección (auth) o CP (guest), hacemos fetchShippingQuotes().
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

  // ====== 6) Determinar costo de envío y total ======
  const shippingThreshold = 699;
  const shippingFee = (subtotal >= shippingThreshold)
    ? 0
    : (selectedQuote ? parseFloat(selectedQuote.total_price) : 0);

  const grandTotal = subtotal + shippingFee;

  // ====== 7) Handlers de qty y remove ======
  const handleRemoveItem = async (uniqueID) => {
    setIsRemoving(uniqueID);
    await removeItemFromCart(uniqueID);
    setIsRemoving(null);
  };

  const handleAddQuantity = async (item) => {
    setIsRemoving(item.uniqueID);
    await addItemToCart({ uniqueID: item.uniqueID, qty: 1 }, false);
    setIsRemoving(null);
  };

  const handleRemoveQuantity = async (item) => {
    if (item.qty > 1) {
      setIsRemoving(item.uniqueID);
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
              // ... Skeleton de carga ...
              <section className="py-8 px-6 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
                <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
                {/* Repetir un map de placeholders */}
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

          {/* ====== Panel de Resumen de Pedido + Cotizaciones ====== */}
          <div>
            {/* Si deseas mostrar un Loader/Spinner específico para "loadingShipping", hazlo aquí */}
            {loading ? (
              // Skeleton para OrderSummary...
              <section className="bg-[#1c1f28] text-white rounded-xl shadow-lg p-6">
                <h3 className="text-3xl font-bold mb-4">Resumen del Pedido</h3>
                {/* placeholders */}
              </section>
            ) : (
              <>
                {/* Mostrar error de envío si existe */}
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

                {/* Opcional: mostrar lista de cotizaciones aquí, 
                    igual que en el CartDrawer */}
                {subtotal < shippingThreshold && shippingQuotes.length > 0 && (
                  <section className="mt-4 p-4 border rounded">
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
                          onChange={() => {
                            // setSelectedQuote(quote) desde context
                            // O lo puedes exponer en tu context o pasar como prop
                          }}
                          className="mr-2"
                        />
                        <span>
                          {quote.carrier} - {quote.service} @ $
                          {parseFloat(quote.total_price).toFixed(2)} / {quote.days} días
                        </span>
                      </label>
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
