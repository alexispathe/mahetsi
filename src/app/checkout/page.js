// src/app/checkout/page.js

'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import UserAddress from '../components/userAddress/UserAddress';
import CartSummary from './CartSummary'; 
import Header from '../components/header/Header';

export default function CheckoutPage() {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [allQuotes, setAllQuotes] = useState([]); // Almacena todas las cotizaciones
  const [selectedQuote, setSelectedQuote] = useState(null); // Cotización seleccionada por el usuario
  const [loadingShipping, setLoadingShipping] = useState(false); // Para manejar el estado de carga de la cotización

  useEffect(() => {
    if (!authLoading && !sessionInitializing && !currentUser) {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, sessionInitializing, currentUser, router]);

  useEffect(() => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(address => address.uniqueID === selectedAddressId);
      if (selectedAddress) {
        setLoadingShipping(true);
        fetch('/api/cotizar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            direccionDestino: selectedAddress
          }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              throw new Error(data.error);
            }
            setAllQuotes(data.all_quotes || []);
            // Opcional: Seleccionar automáticamente la mejor cotización (la más barata)
            if (data.all_quotes && data.all_quotes.length > 0) {
              const mejorCotizacion = data.all_quotes.reduce((prev, current) =>
                parseFloat(prev.total_price) < parseFloat(current.total_price) ? prev : current
              );
              setSelectedQuote(mejorCotizacion);
            } else {
              setSelectedQuote(null);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('No se pudo obtener el costo de envío: ' + error.message);
            setAllQuotes([]);
            setSelectedQuote(null);
          })
          .finally(() => {
            setLoadingShipping(false);
          });
      }
    }
  }, [selectedAddressId, addresses]);

  if (authLoading || sessionInitializing || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Header position="relative" textColor="text-black" />
      <div className="cart-page container mx-auto pt-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserAddress 
            selectedAddressId={selectedAddressId} 
            setSelectedAddressId={setSelectedAddressId} 
            setAddresses={setAddresses} 
            addresses={addresses}
          />
          <CartSummary 
            selectedAddressId={selectedAddressId} 
            addresses={addresses} 
            allQuotes={allQuotes} // Pasamos todas las cotizaciones
            selectedQuote={selectedQuote} // Cotización seleccionada
            setSelectedQuote={setSelectedQuote} // Función para actualizar la selección
            loadingShipping={loadingShipping} // Indicamos si estamos cargando el costo de envío
          />
        </div>
      </div>
    </div>
  );
}
