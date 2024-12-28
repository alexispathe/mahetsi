// src/app/profile/admin/categories/subCategiries/create/page.js

// src/app/profile/admin/categories/subCategiries/create/page.js
"use client";

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext'; // Importando el AuthContext

const CreateSubcategory = () => {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext); // Usando el contexto
  const router = useRouter();

  const [subcategoryData, setSubcategoryData] = useState({
    name: '',
    description: '',
    categoryID: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el botón

  const hasPermission = currentUser?.permissions?.includes('create'); // Verificar si tiene el permiso

  useEffect(() => {
    if (!authLoading && !sessionInitializing) {
      if (!currentUser) {
        router.push('/login'); // Redirige si no está autenticado
      } else if (!hasPermission) {
        router.push('/not-found'); // Redirige si no tiene el permiso
      } else {
        loadCategories(); // Cargar categorías si tiene permiso
      }
    }
  }, [authLoading, currentUser, router, sessionInitializing, hasPermission]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories/private/get/list', {
        method: 'GET',
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
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
    setSubcategoryData({ ...subcategoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!subcategoryData.name.trim()) {
      setError('Por favor, ingresa un nombre válido para la subcategoría.');
      return;
    }

    if (!subcategoryData.categoryID) {
      setError('Por favor, selecciona una categoría.');
      return;
    }

    setIsSubmitting(true); // Deshabilitar el botón y poner "Cargando..."

    try {
      const response = await fetch('/api/categories/private/subCategories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subcategoryData),
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la subcategoría.');
      }

      alert("Subcategoría creada correctamente");
      router.push('/profile/admin/dashboard'); // Redirige al perfil después de la creación
    } catch (err) {
      setError(err.message || 'Error al crear la subcategoría.');
    } finally {
      setIsSubmitting(false); // Reactivar el botón
    }
  };

  if (authLoading || sessionInitializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div> {/* Círculo de carga */}
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        {error ? <p className="text-red-500 mb-2">{error}</p> : <p>No tienes permisos para crear subcategorías.</p>}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Crear Nueva Subcategoría</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre de la Subcategoría</label>
          <input
            type="text"
            name="name"
            value={subcategoryData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Descripción (opcional)</label>
          <textarea
            name="description"
            value={subcategoryData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción de la subcategoría (opcional)"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Categoría</label>
          <select
            name="categoryID"
            value={subcategoryData.categoryID}
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
          {isSubmitting ? 'Cargando...' : 'Crear Subcategoría'}
        </button>
      </form>
    </div>
  );
};

export default CreateSubcategory;
