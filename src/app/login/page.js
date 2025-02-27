'use client';

import React, { Suspense, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/libs/firebaseClient';
import { AuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { BsCheck2Circle } from 'react-icons/bs';
import { BiSolidUser } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-300 mb-4"></div>
            <p className="text-amber-800 font-medium">Cargando...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { currentUser, authLoading } = useContext(AuthContext);
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  // Si ya estamos autenticados, no tiene caso mostrar el botón de login
  useEffect(() => {
    if (!authLoading && currentUser) {
      if (redirect) {
        window.location.href = redirect;
      } else {
        window.location.href = '/profile/user';
      }
    }
  }, [authLoading, currentUser, redirect]);

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const idToken = await user.getIdToken();

        // Crear la sesión en el server
        const res = await fetch('/api/sessionLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ idToken }),
        });

        if (res.ok) {
          // En este punto, la cookie ya está en el navegador (Set-Cookie).
          // Redireccionamos sin necesidad de setTimeout.
          if (redirect) {
            window.location.href = redirect;
          } else {
            window.location.href = '/profile/user';
          }
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
      setLoginLoading(false);
    }
  };

  return (
    <>
      {authLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
          <AiOutlineLoading3Quarters className="animate-spin text-amber-600 text-3xl mr-3" />
          <p className="text-amber-800 font-medium">Verificando sesión...</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Panel decorativo lateral - solo visible en md y superiores */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amber-500 to-orange-400 justify-center items-center p-8">
            <div className="max-w-md text-center">
              <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">Mahets&#39;i & Boh&#39;o</h1>
              <p className="text-white text-xl opacity-90 mb-6">Bienvenido a nuestra plataforma. Descubre experiencias únicas para el cuidado de piel.</p>
              <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-amber-400"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <BsCheck2Circle className="text-white text-xl mr-3" />
                  <p className="text-white text-left">Acceso seguro y rápido</p>
                </div>
                <div className="flex items-center">
                  <BsCheck2Circle className="text-white text-xl mr-3" />
                  <p className="text-white text-left">Servicios personalizados</p>
                </div>
                <div className="flex items-center">
                  <BsCheck2Circle className="text-white text-xl mr-3" />
                  <p className="text-white text-left">Experiencia intuitiva</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de login */}
          <div className="w-full md:w-1/2 flex justify-center items-center p-4 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              {/* Logo versión móvil */}
              <div className="md:hidden text-center mb-8">
                <h1 className="text-3xl font-bold text-amber-600 mb-2">Mahets&#39;i & Boh&#39;o</h1>
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-300"></div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Iniciar Sesión</h2>
              <p className="text-center text-gray-500 mb-8">
                Ingresa con tu cuenta para acceder a todas las funcionalidades
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loginLoading}
                  className="w-full py-3 px-4 rounded-lg flex items-center justify-center text-white font-semibold bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  {loginLoading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin text-white text-xl mr-3" />
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <FcGoogle className="text-2xl mr-3 bg-white rounded-full" />
                      <span>Continuar con Google</span>
                    </>
                  )}
                </button>

                <div className="relative flex items-center justify-center mt-6">
                  <div className="border-t border-gray-300 w-full"></div>
                  <div className="bg-white px-3 text-gray-500 text-sm absolute">
                    O
                  </div>
                </div>

                <button
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center"
                  onClick={() => alert('Funcionalidad no implementada')}
                >
                  <BiSolidUser className="text-xl mr-2 text-gray-500" />
                  <span>Continuar como invitado</span>
                </button>
              </div>

              <p className="text-center mt-8 text-sm text-gray-500">
                Al continuar, aceptas nuestros{' '}
                <a href="#" className="text-amber-600 hover:underline">
                  Términos de servicio
                </a>{' '}
                y{' '}
                <a href="#" className="text-amber-600 hover:underline">
                  Política de privacidad
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}