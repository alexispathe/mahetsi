// src/app/login/page.jsx

'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/libs/firebaseClient';
import { useState} from 'react';
import Header from '../components/Header';
import { getLocalCart, clearLocalCart } from '@/app/utils/cartLocalStorage'; // Importar utilidades del carrito
import { getLocalFavorites, clearLocalFavorites } from '@/app/utils/favoritesLocalStorage'; // Importar utilidades de favoritos

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const idToken = await user.getIdToken();
        const localCart = getLocalCart(); // Obtener carrito local
        const localFavorites = getLocalFavorites(); // Obtener favoritos locales

        // Enviar al API route para crear la cookie y gestionar Firestore
        const res = await fetch('/api/sessionLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Incluir credenciales para enviar cookies
          body: JSON.stringify({ 
            idToken, 
            items: localCart, // Enviar carrito
            favorites: localFavorites, // Enviar favoritos
          }),
        });

        if (res.ok) {
          // Limpiar el carrito y favoritos locales después de la sincronización
          clearLocalCart();
          clearLocalFavorites();
          // Redirigir al perfil o a la página deseada
          // window.location.href = "/profile/user";
        } else {
          const errorData = await res.json();
          console.error('Error al crear sesión:', errorData.error);
          alert(`Error al crear sesión: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error('Error con el login:', error.message);
      alert(`Error con el login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header textColor='text-black' />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">Iniciar Sesión</h1>
          <p className="text-center text-gray-500 mb-6">Autenticación con Google</p>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 transition-all duration-200`}
          >
            {loading ? 'Cargando...' : 'Iniciar con Google'}
          </button>
        </div>
      </div>
    </>
  );
}
