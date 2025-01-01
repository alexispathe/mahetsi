// src/app/profile/admin/categories/update/[url]/page.js

"use client";

import { useContext, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'react-toastify';
const UpdateCategory = () => {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();
  const params = useParams();
  const { url } = params;

  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el botón
  const [categoryLoading, setCategoryLoading] = useState(true); // Estado de carga para la categoría

  const hasPermission = currentUser?.permissions?.includes('update');

  useEffect(() => {
    if (!authLoading && !sessionInitializing) {
      if (!currentUser) {
        router.push('/login');
      } else if (!hasPermission) {
        router.push('/not-found');
      } else if (url) {
        loadCategoryData(url); // Cargar datos de la categoría
      } else {
        setError('No se proporcionó un ID de categoría válido.');
        setCategoryLoading(false);
      }
    }
  }, [authLoading, currentUser, router, sessionInitializing, hasPermission, url]);

  const loadCategoryData = async (url) => {
    try {
      const response = await fetch(`/api/categories/private/get/category/${url}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar la categoría.');
      }

      const data = await response.json();
      setCategoryData({
        name: data.name,
        description: data.description || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setCategoryLoading(false); // Terminar carga de la categoría
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!categoryData.name.trim()) {
      setError('Por favor, ingresa un nombre válido para la categoría.');
      return;
    }

    setIsSubmitting(true); // Deshabilitar el botón

    try {
      const response = await fetch(`/api/categories/private/update/${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryData.name,
          description: categoryData.description,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la categoría.');
      }

      toast.success(
        <div className="flex items-center">
          <span>Categoría actualizada correctamente.</span>
        </div>,
        {
          theme: "light",
          icon: true, 
        }
      );
      router.push('/profile/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false); // Reactivar el botón
    }
  };

  const loading = authLoading || sessionInitializing || categoryLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error && !hasPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <p className="text-red-500 mb-2">{error || 'No tienes permisos para actualizar categorías.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Actualizar Categoría</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre de la Categoría</label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Descripción (opcional)</label>
          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción de la categoría (opcional)"
          />
        </div>
        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar Categoría'}
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
