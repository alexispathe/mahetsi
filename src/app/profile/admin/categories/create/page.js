// src/app/profile/admin/categories/create/page.js

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateCategory = () => {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/verify-session', {
          method: 'GET',
          credentials: 'include', // Asegura que las cookies se envíen con la solicitud
        });
        const data = await response.json();

        if (response.ok && data.message === 'Autenticado') {
          if (data.user.permissions.includes('create')) {
            setHasPermission(true);
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

    checkAuth();
  }, [router]);

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
      const response = await fetch('/api/categories/private/create', {
        method: 'POST',
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
        throw new Error(errorData.message || 'Error al crear la categoría.');
      }

      const responseData = await response.json();
      alert(`Categoría creada correctamente. URL: ${responseData.url}`);
      router.push('/profile/user'); // Redirige al perfil después de la creación
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
        {error ? <p className="text-red-500 mb-2">{error}</p> : <p>No tienes permisos para crear categorías.</p>}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Crear Nueva Categoría</h2>
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
          Crear Categoría
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
