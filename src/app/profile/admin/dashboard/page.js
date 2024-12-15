// src/app/profile/admin/dashboard/page.js
'use client';

import useFetchData from '@/hooks/useFetchData';
import useSessionVerification from '@/hooks/useSessionVerification';
import CollapsibleSection from './components/CollapsibleSection';
const AdminDashboard = () => {
  const { isVerified, loading: sessionLoading, error: sessionError } = useSessionVerification();
  
  // Solo fetch data si la sesión está verificada
  const shouldFetch = isVerified;

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetchData('/api/categories/private/get/list', 'categories');

  const {
    data: subcategories,
    loading: subcategoriesLoading,
    error: subcategoriesError,
  } = useFetchData('/api/categories/private/subCategories/get/list', 'subcategories');

  const {
    data: brands,
    loading: brandsLoading,
    error: brandsError,
  } = useFetchData('/api/brands/private/get/list', 'brands');

  const {
    data: types,
    loading: typesLoading,
    error: typesError,
  } = useFetchData('/api/types/private/get/list', 'types');

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useFetchData('/api/products/private/product/get/list', 'products');

  const loading = sessionLoading || 
                  categoriesLoading || 
                  subcategoriesLoading || 
                  brandsLoading || 
                  typesLoading || 
                  productsLoading;

  const error = sessionError || 
                categoriesError || 
                subcategoriesError || 
                brandsError || 
                typesError || 
                productsError;

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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default AdminDashboard;
