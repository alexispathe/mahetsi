// src/app/components/LogoutButton.jsx

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sessionLogout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirigir al usuario a la ruta "/"
        router.push('/');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Error al cerrar sesión');
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        {loading ? 'Cerrando Sesión...' : 'Cerrar Sesión'}
      </button>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </div>
  );
}
