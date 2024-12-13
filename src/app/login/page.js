'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/libs/firebaseClient';
import { useState } from 'react';
import Header from '../components/Header';
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const idToken = await user.getIdToken();
        // Enviar al API route para crear la cookie
        const res = await fetch('/api/sessionLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        if (res.ok) {
          // Redirigir al perfil
          router.push('/profile/user');
        } else {
          console.error('Error al crear sesión:', await res.text());
        }
      }
    } catch (error) {
      console.error('Error con el login:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
    <Header textColor='text-black'/>
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
