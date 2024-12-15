// src/app/profile/admin/categories/update/[url]/page.js

"use client"; 

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const UpdateCategory = () => {
  const router = useRouter();
  const params = useParams();
  const { url } = params;  
  // Asegúrate de que el parámetro se llame 'url'

  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    if (!url) {
      setError('No se proporcionó un ID de categoría válido.');
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
            loadCategoryData(url); // Cargar datos de la categoría si tiene permiso
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
  }, [router, url]);

  const loadCategoryData = async (url) => {
    try {
      const response = await fetch(`/api/categories/private/get/category/${url}`, {
        method: 'GET',
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });
      console.log(response)
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

    try {
      const response = await fetch(`/api/categories/private/update/${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // No es necesario incluir el header Authorization
        },
        body: JSON.stringify({
          name: categoryData.name,
          description: categoryData.description,
        }),
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la categoría.');
      }

      alert("Categoría actualizada correctamente");
      router.push('/profile/admin/dashboard'); // Redirige al perfil después de la actualización
    } catch (err) {
      setError(err.message);
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
        {error ? <p className="text-red-500 mb-2">{error}</p> : <p>No tienes permisos para actualizar categorías.</p>}
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Actualizar Categoría
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
