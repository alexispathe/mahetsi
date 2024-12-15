// src/app/categories/subCategories/update/[categoryURL]/[subCategoryURL]/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const UpdateSubcategory = () => {
  const router = useRouter();
  const params = useParams();
  const { categoryURL, subCategoryURL } = params;

  const [subcategoryData, setSubcategoryData] = useState({
    name: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    if (!categoryURL || !subCategoryURL) {
      setError('Parámetros de URL faltantes.');
      setLoading(false);
      return;
    }

    const checkAuthAndPermissions = async () => {
      try {
        const response = await fetch('/api/verify-session', {
          method: 'GET',
          credentials: 'include', // Asegura que las cookies se envíen con la solicitud
        });
        const data = await response.json();

        if (response.ok && data.message === 'Autenticado') {
          if (data.user.permissions.includes('update')) {
            setHasPermission(true);
            await loadCategories(); // Cargar categorías si tiene permiso
            await loadSubcategoryData(categoryURL, subCategoryURL); // Cargar datos de la subcategoría
          } else {
            router.push('/not-found'); // Redirige si no tiene permiso
          }
        } else {
          router.push('/login'); // Redirige si no está autenticado
        }
      } catch (err) {
        console.error('Error al verificar la autenticación:', err);
        setError('Error al verificar la autenticación.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndPermissions();
  }, [router, categoryURL, subCategoryURL]);

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

  const loadSubcategoryData = async (categoryURL, subCategoryURL) => {
    try {
      const response = await fetch(`/api/categories/private/subCategories/get/${categoryURL}/${subCategoryURL}`, {
        method: 'GET',
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });

      if (response.ok) {
        const data = await response.json();
        setSubcategoryData({
          name: data.name,
          description: data.description || '',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar la subcategoría.');
      }
    } catch (error) {
      console.error('Error al cargar la subcategoría:', error);
      setError('Error al cargar la subcategoría.');
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

    try {
      const response = await fetch(`/api/categories/private/subCategories/update/${categoryURL}/${subCategoryURL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subcategoryData),
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la subcategoría.');
      } else {
        alert("Subcategoría actualizada correctamente");
        router.push('/profile/admin/dashboard'); // Redirige al perfil después de la actualización
      }
    } catch (err) {
      console.error('Error al actualizar la subcategoría:', err);
      setError(err.message || 'Error al actualizar la subcategoría.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        {error ? <p className="text-red-500 mb-2">{error}</p> : <p>No tienes permisos para actualizar subcategorías.</p>}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Actualizar Subcategoría</h2>
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Actualizar Subcategoría
        </button>
      </form>
    </div>
  );
};

export default UpdateSubcategory;
