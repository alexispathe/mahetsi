"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../libs/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const CreateType = () => {
  const router = useRouter();
  const [typeData, setTypeData] = useState({
    name: '',
    description: '',
    categoryID: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        checkUserPermissions(user.uid);
      }
    });
    return () => unsubscribe(); // Limpieza del suscriptor
  }, [router]);

  useEffect(() => {
    if (hasPermission) {
      fetchCategories();
    }
  }, [hasPermission]);

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
      // Verifica si el rol tiene el permiso 'create'
      if (roleData.permissions.includes('create')) {
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

    try {
      const token = await auth.currentUser.getIdToken(); // Obtén el token del usuario
      const response = await fetch('/api/types/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token en la cabecera
        },
        body: JSON.stringify({
          name: typeData.name,
          description: typeData.description,
          categoryID: typeData.categoryID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el tipo.');
      }

      const responseData = await response.json();
      alert(`Tipo creado correctamente. URL: ${responseData.url}`);
      router.push('/users/profile'); // Redirige al perfil después de la creación
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Crear Tipo
        </button>
      </form>
    </div>
  );
};

export default CreateType;
