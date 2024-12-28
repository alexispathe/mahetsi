// src/app/profile/admin/roles/create/page.js
"use client";

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext'; // <-- Importa tu AuthContext

export default function CreateRole() {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  // Datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    permissions: '',
    description: '',
  });

  // Estados para manejo de errores, éxito, carga de envío
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Desactivar botón y mostrar "Creando..."

  // Verifica si el usuario tiene permiso (ej. 'create')
  const hasPermission = currentUser?.permissions?.includes('create');

  useEffect(() => {
    if (!authLoading && !sessionInitializing) {
      // Si no está logueado => login
      if (!currentUser) {
        router.push('/login');
      }
      // Si no tiene el permiso => not-found
      else if (!hasPermission) {
        router.push('/not-found');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading, sessionInitializing]);

  // Manejo de cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación básica
    if (!formData.name.trim()) {
      setError('El nombre del rol es obligatorio.');
      return;
    }

    // Procesar permisos (si están separados por comas)
    const permissionsArray = formData.permissions
      ? formData.permissions.split(',').map((p) => p.trim())
      : [];

    // Construimos el payload
    const payload = {
      name: formData.name.trim(),
      permissions: permissionsArray,
      description: formData.description.trim(),
    };

    // Deshabilitamos el botón
    setIsSubmitting(true);

    try {
      // Llamada a la API para crear el rol
      const response = await fetch('/api/roles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
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
      setIsSubmitting(false);
    }
  };

  // (1) Mientras se verifica la sesión => Spinner
  if (authLoading || sessionInitializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // (2) Si no tiene permisos
  if (currentUser && !hasPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        {error ? (
          <p className="text-red-500 mb-2">{error}</p>
        ) : (
          <p>No tienes permisos para crear roles.</p>
        )}
      </div>
    );
  }

  // (3) Formulario cuando todo está OK
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
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isSubmitting ? 'Creando...' : 'Crear Rol'}
        </button>
      </form>
    </div>
  );
}
