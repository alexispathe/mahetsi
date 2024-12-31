'use client';

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import UserAddress from '../components/UserAddress';
import CartSummary from './CartSummary'; 
import Header from '../components/Header';

export default function CartPage() {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Redirige al login si no hay usuario autenticado una vez que se completa la carga
    if (!authLoading && !sessionInitializing && !currentUser) {
      router.push('/login');
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
    <div className='user-details-container bg-white py-10 px-6 shadow-lg rounded-lg'>
      <Header position="relative" textColor="text-black" />
      <div className="cart-page container mx-auto pt-20 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserAddress />  {/* Sección de dirección y forma de pago */}
          <CartSummary /> {/* Sección del resumen de la compra */}
        </div>
      </div>
    </div>
  );
}
