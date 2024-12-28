// src/app/profile/admin/brand/create/page.js

"use client";

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import useFetchData from '@/hooks/useFetchData';

const CreateBrand = () => {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  const [brandData, setBrandData] = useState({
    name: '',
    description: '',
    categoryID: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el botón

  const hasPermission = currentUser?.permissions?.includes('create');

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetchData(
    hasPermission ? '/api/categories/private/get/list' : null,
    'categories',
    hasPermission
  );

  const loading = authLoading || sessionInitializing || categoriesLoading;
  const fetchError = categoriesError;

  useEffect(() => {
    if (!authLoading && !sessionInitializing) {
      if (!currentUser) {
        router.push('/login');
      } else if (!hasPermission) {
        router.push('/not-found');
      }
    }
  }, [authLoading, currentUser, router, sessionInitializing, hasPermission]);

  if (authLoading || sessionInitializing || (!currentUser && !authLoading)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <p className="text-red-500 mb-2">Error: {fetchError}</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData({ ...brandData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!brandData.name.trim()) {
      setError('Por favor, ingresa un nombre válido para la marca.');
      return;
    }

    if (!brandData.categoryID) {
      setError('Por favor, selecciona una categoría.');
      return;
    }

    setIsSubmitting(true); // Deshabilitar el botón al iniciar el envío

    try {
      const response = await fetch('/api/brands/private/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: brandData.name,
          description: brandData.description,
          categoryID: brandData.categoryID,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la marca.');
      }

      const responseData = await response.json();
      alert(`Marca creada correctamente. URL: ${responseData.url}`);
      router.push('/profile/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false); // Reactivar el botón después del envío
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Crear Nueva Marca</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre de la Marca</label>
          <input
            type="text"
            name="name"
            value={brandData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Descripción (opcional)</label>
          <textarea
            name="description"
            value={brandData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción de la marca (opcional)"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Categoría</label>
          <select
            name="categoryID"
            value={brandData.categoryID}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.uniqueID} value={category.uniqueID}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSubmitting} // Deshabilitar el botón mientras se envía
        >
          {isSubmitting ? 'Creando...' : 'Crear Marca'}
        </button>
      </form>
    </div>
  );
};

export default CreateBrand;
