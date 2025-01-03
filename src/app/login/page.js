// src/app/login/page.js
'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/libs/firebaseClient';
import { getLocalCart, clearLocalCart } from '@/app/utils/cartLocalStorage';
import { getLocalFavorites, clearLocalFavorites } from '@/app/utils/favoritesLocalStorage';
import Header from '../components/Header';
import { AuthContext } from '@/context/AuthContext';

export default function LoginPage() {
  const { currentUser, authLoading } = useContext(AuthContext); // Usar el contexto
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && currentUser) {
      router.push('/profile/user'); // Redirige si ya está autenticado
    }
  }, [authLoading, currentUser, router]);

  const waitForCookie = async () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (document.cookie.split(';').some((item) => item.trim().startsWith('session='))) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100); // Verificar cada 100ms
    });
  };

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const idToken = await user.getIdToken();
        const localCart = getLocalCart();
        const localFavorites = getLocalFavorites();

        const res = await fetch('/api/sessionLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            idToken,
            items: localCart,
            favorites: localFavorites,
          }),
        });

        if (res.ok) {
          clearLocalCart();
          clearLocalFavorites();

          // Esperar la creación de la cookie
          await waitForCookie();

          // Redirigir al perfil después de asegurar que la cookie existe
          router.push('/profile/user');
        } else {
          const errorData = await res.json();
          console.error('Error al crear sesión:', errorData.error);
        }
      }
    } catch (error) {
      console.error('Error con el login:', error.message);
      alert(`Error con el login: ${error.message}`);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      {authLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      ) : (
        <>
          <Header textColor="text-black" />
          <div className="flex justify-center items-center min-h-screen bg-gray-100 py-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
              <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">Iniciar Sesión</h1>
              <p className="text-center text-gray-500 mb-6">Autenticación con Google</p>
              <button
                onClick={handleGoogleLogin}
                disabled={loginLoading}
                className={`w-full py-2 px-4 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 transition-all duration-200`}
              >
                {loginLoading ? 'Iniciando sesión...' : 'Iniciar con Google'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}