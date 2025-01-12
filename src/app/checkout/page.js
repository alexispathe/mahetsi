// src/app/checkout/page.js

'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import UserAddress from '../components/UserAddress';
import CartSummary from './CartSummary'; 
import Header from '../components/header/Header';

export default function CheckoutPage() {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [shippingCost, setShippingCost] = useState(null); // Aquí guardaremos el costo de envío
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
            setShippingCost(data.shipping_cost);
            setShippingInfo({
              carrier: data.carrier,
              service: data.service,
              days: data.estimated_days
            });
          })
          .catch(error => {
            console.error('Error:', error);
            alert('No se pudo obtener el costo de envío: ' + error.message);
            setShippingCost(null);
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
            shippingCost={shippingCost} // Pasamos el costo de envío
            loadingShipping={loadingShipping} // Indicamos si estamos cargando el costo de envío
          />
        </div>
      </div>
    </div>
  );
}
