// src/app/profile/admin/roles/create/page.js

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRole() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    permissions: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para controlar si el usuario está autenticado
  const [permissions, setPermissions] = useState([]); // Opcional: Permisos del usuario

  // Verificar autenticación usando la API
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/verify-session', {
          method: 'GET',
          credentials: 'include', // Asegura que las cookies se envíen con la solicitud
        });
        const data = await response.json();

        if (response.ok && data.message === 'Autenticado') {
          setIsAuthenticated(true); // Si la respuesta es positiva, autenticamos al usuario
          setPermissions(data.user.permissions); // Opcional: Guardar permisos en el estado
        } else {
          router.push('/login'); // Redirigimos al login si no está autenticado
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Activar el estado de carga

    // Validación básica
    if (!formData.name.trim()) {
      setError('El nombre del rol es obligatorio.');
      setLoading(false); // Desactivar carga si hay error
      return;
    }

    // Procesar permisos (separados por comas)
    const permissionsArray = formData.permissions
      ? formData.permissions.split(',').map(p => p.trim())
      : [];

    const payload = {
      name: formData.name.trim(),
      permissions: permissionsArray,
      description: formData.description.trim(),
    };

    try {
      if (!isAuthenticated) {
        setError('Usuario no autenticado.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/roles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // **No es necesario incluir el header Authorization**
        },
        body: JSON.stringify(payload),
        credentials: 'include', // Asegura que las cookies se envíen con la solicitud
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el rol.');
      }

      setSuccess('Rol creado exitosamente.');
      setFormData({ name: '', permissions: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Desactivar carga al finalizar
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Crear Nuevo Rol</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre del Rol</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Permisos (separados por comas)</label>
          <input
            type="text"
            name="permissions"
            value={formData.permissions}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., leer, escribir, eliminar"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Descripción del rol (opcional)"
          />
        </div>
        <button
          type="submit"
          className={`w-full ${loading ? 'bg-gray-500' : 'bg-green-500'} text-white py-2 rounded hover:bg-green-600`}
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Rol'}
        </button>
      </form>
    </div>
  );
}
