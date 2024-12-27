// src/app/profile/admin/dashboard/page.js
'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import useFetchData from '@/hooks/useFetchData';
import CollapsibleSection from './components/CollapsibleSection';
import Header from '@/app/components/Header';

const AdminDashboard = () => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const router = useRouter();

  // Redirigir si no está autenticado o no tiene permisos adecuados
  useEffect(() => {
    if (
      !authLoading &&
      (!currentUser ||
        !currentUser.permissions?.includes('create') ||
        !currentUser.permissions?.includes('update'))
    ) {
      router.push('/login'); // Redirige al login si no tiene permisos
    }
  }, [authLoading, currentUser, router]);

  // Solo hacer fetch si el usuario está autenticado y tiene permisos
  const shouldFetch =
    currentUser?.permissions?.includes('create') &&
    currentUser?.permissions?.includes('update');

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetchData(
    shouldFetch ? '/api/categories/private/get/list' : null,
    'categories',
    shouldFetch
  );

  const {
    data: subcategories,
    loading: subcategoriesLoading,
    error: subcategoriesError,
  } = useFetchData(
    shouldFetch ? '/api/categories/private/subCategories/get/list' : null,
    'subcategories',
    shouldFetch
  );

  const {
    data: brands,
    loading: brandsLoading,
    error: brandsError,
  } = useFetchData(
    shouldFetch ? '/api/brands/private/get/list' : null,
    'brands',
    shouldFetch
  );

  const {
    data: types,
    loading: typesLoading,
    error: typesError,
  } = useFetchData(
    shouldFetch ? '/api/types/private/get/list' : null,
    'types',
    shouldFetch
  );

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useFetchData(
    shouldFetch ? '/api/products/private/product/get/list' : null,
    'products',
    shouldFetch
  );

  const loading =
    authLoading ||
    categoriesLoading ||
    subcategoriesLoading ||
    brandsLoading ||
    typesLoading ||
    productsLoading;

  const error =
    categoriesError ||
    subcategoriesError ||
    brandsError ||
    typesError ||
    productsError;

  // Determinar si el usuario está autenticado y tiene permisos
  const isAuthorized = !authLoading && shouldFetch;

  if (authLoading || !isAuthorized) {
    // Mientras se verifica la autenticación y permisos, muestra el spinner
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header textColor="black" position="relative" />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Panel de Administración</h1>

        {/* Secciones Desplegables */}
        <div className="space-y-6">
          <CollapsibleSection
            title="Categorías"
            color="bg-blue-500 hover:bg-blue-600"
            createPath="/profile/admin/categories/create"
            updatePath="/profile/admin/categories/update"
            items={categories}
          />
          <CollapsibleSection
            title="Subcategorías"
            color="bg-purple-500 hover:bg-purple-600"
            createPath="/profile/admin/subCategories/create"
            updatePath="/profile/admin/subCategories/update"
            items={subcategories}
          />
          <CollapsibleSection
            title="Marcas"
            color="bg-red-500 hover:bg-red-600"
            createPath="/profile/admin/brands/create"
            updatePath="/profile/admin/brands/update"
            items={brands}
          />
          <CollapsibleSection
            title="Tipos"
            color="bg-yellow-500 hover:bg-yellow-600"
            createPath="/profile/admin/types/create"
            updatePath="/profile/admin/types/update"
            items={types}
          />
          <CollapsibleSection
            title="Productos"
            color="bg-green-500 hover:bg-green-600"
            createPath="/profile/admin/products/create"
            updatePath="/profile/admin/products/update"
            items={products}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
