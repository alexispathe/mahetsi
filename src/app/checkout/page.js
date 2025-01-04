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

  useEffect(() => {
    // Redirige al login si no hay usuario autenticado una vez que se completa la carga
    if (!authLoading && !sessionInitializing && !currentUser) {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, sessionInitializing, currentUser, router]);

  if (authLoading || sessionInitializing || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=''>
      <Header position="relative" textColor="text-black" />
      <div className="cart-page container mx-auto pt-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserAddress 
            selectedAddressId={selectedAddressId} 
            setSelectedAddressId={setSelectedAddressId} 
            setAddresses={setAddresses} 
            addresses={addresses} // Asegúrate de pasar 'addresses' como prop
          />  {/* Sección de dirección y forma de pago */}
          <CartSummary 
            selectedAddressId={selectedAddressId} 
            addresses={addresses} // Asegúrate de pasar 'addresses' como prop si es necesario
          /> {/* Sección del resumen de la compra */}
        </div>
      </div>
    </div>
  );
}
