// src/app/profile/admin/types/create/page.js
"use client";

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'react-toastify';
const CreateType = () => {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  const [typeData, setTypeData] = useState({
    name: '',
    description: '',
    categoryID: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el botón

  const hasPermission = currentUser?.permissions?.includes('create');

  useEffect(() => {
    if (!authLoading && !sessionInitializing) {
      if (!currentUser) {
        router.push('/login');
      } else if (!hasPermission) {
        router.push('/not-found');
      } else {
        fetchCategories(); // Cargar categorías si tiene permiso
      }
    }
  }, [authLoading, currentUser, router, sessionInitializing, hasPermission]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/private/get/list', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar las categorías.');
      }
    } catch (error) {
      setError('Error al cargar las categorías.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTypeData({ ...typeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!typeData.name.trim()) {
      setError('Por favor, ingresa un nombre válido para el tipo.');
      return;
    }

    if (!typeData.categoryID) {
      setError('Por favor, selecciona una categoría.');
      return;
    }

    setIsSubmitting(true); // Deshabilitar el botón

    try {
      const response = await fetch('/api/types/private/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: typeData.name,
          description: typeData.description,
          categoryID: typeData.categoryID,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el tipo.');
      }

      toast.success(
        <div className="flex items-center">
          <span>Tipo creado correctamente.</span>
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

  if (authLoading || sessionInitializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        {error ? <p className="text-red-500 mb-2">{error}</p> : <p>No tienes permisos para crear tipos.</p>}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Crear Nuevo Tipo</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre del Tipo</label>
          <input
            type="text"
            name="name"
            value={typeData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Descripción (opcional)</label>
          <textarea
            name="description"
            value={typeData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción del tipo (opcional)"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Categoría</label>
          <select
            name="categoryID"
            value={typeData.categoryID}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando...' : 'Crear Tipo'}
        </button>
      </form>
    </div>
  );
};

export default CreateType;
