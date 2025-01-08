// src/app/hooks/useLogout.js

import { useState } from 'react';

export default function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
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
        window.location.href = '/'; // Cambia la URL y recarga la página
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

  return { loading, error, handleLogout };
}
