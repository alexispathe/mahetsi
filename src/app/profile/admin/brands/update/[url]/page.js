// src/app/profile/admin/brand/update/[url]/page.js

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const UpdateBrand = () => {
  const router = useRouter();
  const params = useParams();
  const { url } = params; // Captura el parámetro 'url' de la ruta

  const [brandData, setBrandData] = useState({
    name: '',
    description: '',
    categoryID: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    if (!url) {
      setError('No se proporcionó una URL de marca válida.');
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
            fetchCategories(); // Cargar categorías si tiene permiso
            loadBrandData(url); // Cargar datos de la marca si tiene permiso
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

  const fetchCategories = async () => {
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

  const loadBrandData = async (url) => {
    try {
      const response = await fetch(`/api/brands/private/get/brand/${url}`, {
        method: 'GET',
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar la marca.');
      }

      const data = await response.json();
      setBrandData({
        name: data.name,
        description: data.description || '',
        categoryID: data.categoryID || '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

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

    try {
      const response = await fetch(`/api/brands/private/update/${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // No es necesario incluir el header Authorization
        },
        body: JSON.stringify({
          name: brandData.name,
          description: brandData.description,
          categoryID: brandData.categoryID,
        }),
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la marca.');
      }

      alert("Marca actualizada correctamente");
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
        {error ? <p className="text-red-500 mb-2">{error}</p> : <p>No tienes permisos para actualizar marcas.</p>}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Actualizar Marca</h2>
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Actualizar Marca
        </button>
      </form>
    </div>
  );
};

export default UpdateBrand;