"use client";

import { useEffect, useState } from 'react';
import { useRouter,useParams } from 'next/navigation';
import { auth } from '../../../../libs/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const UpdateBrand = () => {
  const router = useRouter();
  const params = useParams();
  const { url } = params; // Captura el parámetro 'url' de la rutaL

  const [brandData, setBrandData] = useState({
    name: '',
    description: '',
    categoryID: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!url) {
      setError('No se proporcionó un ID de marca válido.');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        checkUserPermissions(user.uid);
      }
    });
    return () => unsubscribe(); // Limpieza del suscriptor
  }, [router, url]);

  useEffect(() => {
    if (hasPermission) {
      fetchCategories();
      loadBrandData(url);
    }
  }, [hasPermission, url]);

  const checkUserPermissions = async (userId) => {
    try {
      const token = await auth.currentUser.getIdToken(); // Obtén el token del usuario
      const userResponse = await fetch(`/api/users/${userId}/get`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Incluye el token en la cabecera
        },
      });

      if (!userResponse.ok) {
        throw new Error('Error al obtener datos del usuario.');
      }

      const userData = await userResponse.json();
      const { roleId } = userData;

      // Verifica los permisos del rol correspondiente
      const roleResponse = await fetch(`/api/roles/get/${roleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Incluye el token en la cabecera
        },
      });

      if (!roleResponse.ok) {
        throw new Error('Error al obtener los permisos del rol.');
      }

      const roleData = await roleResponse.json();
      // Verifica si el rol tiene el permiso 'update'
      if (roleData.permissions.includes('update')) {
        setHasPermission(true);
      } else {
        router.push('/not-found'); // Redirige si no tiene permiso
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/categories/get/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        setError('Error al cargar las categorías.');
      }
    } catch (error) {
      setError('Error al cargar las categorías.');
    }
  };

  const loadBrandData = async (url) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/brands/get/brand/${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar la marca.');
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
      const token = await auth.currentUser.getIdToken(); // Obtén el token del usuario
      const response = await fetch(`/api/brands/update/${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token en la cabecera
        },
        body: JSON.stringify({
          name: brandData.name,
          description: brandData.description,
          categoryID: brandData.categoryID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la marca.');
      }

      alert("Marca actualizada correctamente");
      router.push('/users/profile'); // Redirige al perfil después de la actualización
    } catch (err) {
      setError(err.message);
    }
  };

  if (!hasPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        {error ? <p className="text-red-500 mb-2">{error}</p> : <p>Cargando...</p>}
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
