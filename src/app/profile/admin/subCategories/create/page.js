// src/app/profile/admin/categories/subCategiries/create/page.js

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateSubcategory = () => {
  const router = useRouter();
  const [subcategoryData, setSubcategoryData] = useState({
    name: '',
    description: '',
    categoryID: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    const checkAuthAndPermissions = async () => {
      try {
        const response = await fetch('/api/verify-session', {
          method: 'GET',
          credentials: 'include', // Asegura que las cookies se envíen con la solicitud
        });
        const data = await response.json();

        if (response.ok && data.message === 'Autenticado') {
          if (data.user.permissions.includes('create')) {
            setHasPermission(true);
            await loadCategories(); // Cargar categorías si tiene permiso
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
  }, [router]);

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

    try {
      const response = await fetch('/api/categories/private/subCategories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No es necesario incluir el header Authorization
        },
        body: JSON.stringify(subcategoryData),
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la subcategoría.');
      }

      const responseData = await response.json();
      alert("Subcategoría creada correctamente");
      router.push('/profile/admin/dashboard'); // Redirige al perfil después de la creación
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Crear Subcategoría
        </button>
      </form>
    </div>
  );
};

export default CreateSubcategory;
