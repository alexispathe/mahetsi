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

  // Ya no le pedimos al usuario que escoja la dirección
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [allQuotes, setAllQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Redirección segura
  useEffect(() => {
    if (!authLoading && !sessionInitializing && !currentUser) {
      router.replace('/login?redirect=/checkout');
    }
  }, [authLoading, sessionInitializing, currentUser, router]);

  // Cada vez que `addresses` cambie, detectamos la principal
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      // Si existe, la usamos
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.uniqueID);
      } else {
        setSelectedAddressId(null); // o podrías forzar a que agregue/setee una como principal
      }
    }
  }, [addresses]);

  // Efecto para cotizar
  useEffect(() => {
    // Solo cotizamos si hay un currentUser y si se encontró una dirección principal
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
              // Tomar la cotización de menor precio (por ejemplo)
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
        <UserAddress 
         loadingShipping={loadingShipping}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          setAddresses={setAddresses}
          addresses={addresses}
        />
        <CartSummary 
          // Solo pasamos selectedAddressId para enviar al backend si se ocupa
          selectedAddressId={selectedAddressId}
          allQuotes={allQuotes}
          selectedQuote={selectedQuote}
          setSelectedQuote={setSelectedQuote}
          loadingShipping={loadingShipping}
        />
      </div>
    </div>
  );
}
