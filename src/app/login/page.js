// src/app/login/page.js
'use client';

import React, { Suspense, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/libs/firebaseClient';
import { AuthContext } from '@/context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { BsCheck2Circle } from 'react-icons/bs';
import { BiSolidUser } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-300 mb-4"></div>
            <p className="text-green-600 font-medium">Cargando...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

// Componente Modal reutilizable
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay semitransparente */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Contenedor del modal */}
      <div className="bg-white rounded-lg shadow-lg z-10 max-w-lg w-full mx-4 p-6 relative">
        {/* Botón para cerrar */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div className="max-h-80 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { currentUser, authLoading } = useContext(AuthContext);
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
  // Estados para controlar la visibilidad de cada modal
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Si ya estamos autenticados, redireccionamos
  useEffect(() => {
    if (!authLoading && currentUser) {
      window.location.href = redirect ? redirect : '/profile/user';
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
          window.location.href = redirect ? redirect : '/profile/user';
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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-white">
          <AiOutlineLoading3Quarters className="animate-spin text-green-600 text-3xl mr-3" />
          <p className="text-green-600 font-medium">Verificando sesión...</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Panel decorativo lateral - solo visible en md y superiores */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 to-green-400 justify-center items-center p-8">
            <div className="max-w-md text-center">
              <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">Mahets&#39;i &amp; Boh&#39;o</h1>
              <p className="text-white text-xl opacity-90 mb-6">
                Bienvenido a nuestra tienda de jabones naturales. Descubre experiencias únicas para el cuidado de tu piel.
              </p>
              <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <BsCheck2Circle className="text-white text-xl mr-3" />
                  <p className="text-white text-left">Acceso seguro y rápido</p>
                </div>
                <div className="flex items-center">
                  <BsCheck2Circle className="text-white text-xl mr-3" />
                  <p className="text-white text-left">Productos naturales y auténticos</p>
                </div>
                <div className="flex items-center">
                  <BsCheck2Circle className="text-white text-xl mr-3" />
                  <p className="text-white text-left">Experiencia intuitiva</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de login */}
          <div className="w-full md:w-1/2 flex justify-center items-center p-4 sm:p-8 bg-gradient-to-br from-green-100 to-white">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              {/* Logo versión móvil */}
              <div className="md:hidden text-center mb-8">
                <h1 className="text-3xl font-bold text-green-600 mb-2">Mahets&#39;i &amp; Boh&#39;o</h1>
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-green-300"></div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-black mb-2 text-center">Iniciar Sesión</h2>
              <p className="text-center text-black mb-8">
                Ingresa con tu cuenta para acceder a todas las funcionalidades
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loginLoading}
                  className="w-full py-3 px-4 rounded-lg flex items-center justify-center text-white font-semibold bg-green-600 hover:bg-green-700 disabled:bg-green-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
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
                  <div className="border-t border-black w-full"></div>
                  <div className="bg-white px-3 text-black text-sm absolute">O</div>
                </div>

                <Link
                  className="w-full py-3 px-4 rounded-lg border border-black text-black font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center"
                  href="/"
                >
                  <BiSolidUser className="text-xl mr-2 text-black" />
                  <span>Continuar como invitado</span>
                </Link>
              </div>

              <p className="text-center mt-8 text-sm text-black">
                Al continuar, aceptas nuestros{' '}
                <button type="button" onClick={() => setShowTerms(true)} className="text-green-600 hover:underline">
                  Términos de servicio
                </button>{' '}
                y{' '}
                <button type="button" onClick={() => setShowPrivacy(true)} className="text-green-600 hover:underline">
                  Política de privacidad
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Términos de Servicio */}
      <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Términos de Servicio">
        <p className="text-black text-sm">
          Aquí irían los términos de servicio de la aplicación. Puedes incluir toda la información relevante sobre el uso del servicio, derechos y obligaciones, y otros detalles legales necesarios.
        </p>
      </Modal>

      {/* Modal de Política de Privacidad */}
      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Política de Privacidad">
        <p className="text-black text-sm">
          Aquí iría la política de privacidad de la aplicación. Detalla cómo se manejan los datos personales, las medidas de seguridad implementadas y otros aspectos relacionados con la privacidad.
        </p>
      </Modal>
    </>
  );
}
