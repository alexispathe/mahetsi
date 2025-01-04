// src/app/profile/user/page.js

'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Header from '../../components/Header';
import LogoutButton from './LogoutButton';
import Image from 'next/image';
import AdminButton from './AdminButton';
import OrdersTable from './OrdersTable';
import AdminOrders from '../admin/orders/AdminOrders';
import UserAddress from '../../components/UserAddress'; // Asegúrate de que la ruta sea correcta

export default function ProfilePage() {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Estados para direcciones
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    // Redirige al login si no hay usuario autenticado una vez que se completa la carga
    if (!authLoading && !sessionInitializing && !currentUser) {
      router.push('/login');
    }
  }, [authLoading, sessionInitializing, currentUser, router]);

  useEffect(() => {
    if (currentUser && !authLoading && !sessionInitializing) {
      fetchOrders();
      // También puedes cargar direcciones aquí si no lo haces en el componente UserAddress
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading, sessionInitializing]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const res = await fetch('/api/orders/get', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders);
      } else {
        setOrdersError(data.message || 'Error al obtener las órdenes.');
      }
    } catch (err) {
      console.error('Error al obtener las órdenes:', err);
      setOrdersError('Error al obtener las órdenes.');
    } finally {
      setLoadingOrders(false);
    }
  };

  if (authLoading || sessionInitializing || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const { email, name, picture, uid, permissions } = currentUser;
  // Verificar si el usuario tiene permisos 'admin'
  const isAdmin = permissions?.includes('admin');

  return (
    <>
      <Header textColor="black" position="relative" />
      <div className="container mx-auto p-4">
        {/* Información del Perfil */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center">
            {picture && (
              <Image
                src={picture}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6 object-cover"
                width={96}
                height={96}
              />
            )}
            <div>
              <h1 className="text-2xl font-semibold mb-2">Perfil de {name}</h1>
              <p className="text-gray-600">Email: {email}</p>
            </div>
          </div>
          <div className="mt-4">
            <LogoutButton />
          </div>
          {isAdmin && <AdminButton />}
        </div>

        {/* Sección de Direcciones */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Mis Direcciones</h2>
          <UserAddress
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            setAddresses={setAddresses}
            addresses={addresses}
          />
        </div>

        {/* Sección de Órdenes de Usuario */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Mis Compras</h2>
          {loadingOrders ? (
            <p>Cargando órdenes...</p>
          ) : ordersError ? (
            <p className="text-red-500">{ordersError}</p>
          ) : (
            <OrdersTable orders={orders} />
          )}
        </div>

        {/* Sección de Órdenes de Admin */}
        {isAdmin && <AdminOrders />}
      </div>
    </>
  );
}
