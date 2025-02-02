// src/app/checkout/page.js
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import UserAddress from '../components/userAddress/UserAddress';
import CartSummary from './CartSummary';
import Loader from '../components/Loader';

export default function CheckoutPage() {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  // Estado para la dirección seleccionada y la lista de direcciones
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  
  // Estados para cotización de envío
  const [allQuotes, setAllQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Redirección si el usuario no está autenticado
  useEffect(() => {
    if (!authLoading && !sessionInitializing && !currentUser) {
      router.replace('/login?redirect=/checkout');
    }
  }, [authLoading, sessionInitializing, currentUser, router]);

  // Cada vez que cambie la lista de direcciones, se busca la dirección principal
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.uniqueID);
      } else {
        setSelectedAddressId(null);
      }
    }
  }, [addresses]);

  // Efecto para cotizar el envío cuando se tenga una dirección seleccionada y el usuario esté autenticado
  useEffect(() => {
    if (selectedAddressId && currentUser) {
      const selectedAddress = addresses.find(
        (address) => address.uniqueID === selectedAddressId
      );
      if (selectedAddress) {
        setLoadingShipping(true);
        fetch('/api/cotizar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`, // Envío seguro del token
          },
          body: JSON.stringify({
            direccionDestino: selectedAddress,
          }),
        })
          .then(handleApiResponse)
          .then((data) => {
            setAllQuotes(data.all_quotes || []);
            if (data.all_quotes?.length > 0) {
              // Por ejemplo, se toma la cotización de menor precio
              const cheapest = data.all_quotes.reduce((prev, current) =>
                parseFloat(prev.total_price) < parseFloat(current.total_price)
                  ? prev
                  : current
              );
              setSelectedQuote(cheapest);
            } else {
              setSelectedQuote(null);
            }
          })
          .catch(handleApiError)
          .finally(() => setLoadingShipping(false));
      }
    } else {
      // Si no hay dirección principal, vaciamos las cotizaciones
      setAllQuotes([]);
      setSelectedQuote(null);
    }
  }, [selectedAddressId, addresses, currentUser]);

  const handleApiResponse = (response) => {
    if (!response.ok) throw new Error('Error en la respuesta del servidor');
    return response.json();
  };

  const handleApiError = (error) => {
    console.error('Error:', error);
    alert(error.message || 'Error al procesar la solicitud');
    setAllQuotes([]);
    setSelectedQuote(null);
  };

  if (authLoading || sessionInitializing) return <Loader fullScreen />;
  if (!currentUser) return null;

  return (
    <div className="cart-page container mx-auto pt-20 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda: Gestión de direcciones */}
        <UserAddress 
          loadingShipping={loadingShipping}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          setAddresses={setAddresses}
          addresses={addresses}
        />
        {/* Columna derecha: Resumen del carrito y cotización de envío */}
        <CartSummary 
          selectedAddressId={selectedAddressId}
          allQuotes={allQuotes}
          selectedQuote={selectedQuote}
          setSelectedQuote={setSelectedQuote}
          loadingShipping={loadingShipping}
          currentUser={currentUser}
          shippingAddress={addresses.find(addr => addr.uniqueID === selectedAddressId)}
        />
      </div>
    </div>
  );
}
