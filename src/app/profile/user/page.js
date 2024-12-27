'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Header from '@/app/components/Header';
import LogoutButton from './LogoutButton'; 
import Image from 'next/image';
import AdminButton from './AdminButton';
import OrdersTable from './OrderTable';
import { orders } from '../../category/data';

export default function ProfilePage() {
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const { email, name, picture, uid, permissions } = currentUser;

  // Verificar si el usuario tiene permisos 'create' o 'update'
  const hasAdminAccess = permissions?.includes('create') || permissions?.includes('update');

  // Filtrar las órdenes del usuario autenticado
  const userOrders = orders.filter(order => order.ownerId === uid);

  return (
    <>
      <Header textColor="black" position="relative" />
      <div className="container mx-auto p-4">
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
          {hasAdminAccess && <AdminButton />}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mis Compras</h2>
          <OrdersTable orders={userOrders} />
        </div>
      </div>
    </>
  );
}
