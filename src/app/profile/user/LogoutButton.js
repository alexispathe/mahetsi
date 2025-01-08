// src/app/components/LogoutButton.jsx


'use client';

import useLogout from '@/hooks/useLogout';

export default function LogoutButton() {
  const { loading, error, handleLogout } = useLogout();

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
