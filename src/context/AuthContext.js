// src/context/AuthContext.jsx
'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/libs/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionInitialized, setSessionInitialized] = useState(false); // Nuevo estado

  useEffect(() => {
    const handleSessionReady = () => {
      setSessionInitialized(true);
    };

    // Escuchar el evento personalizado cuando la cookie esté lista
    window.addEventListener('sessionReady', handleSessionReady);

    const checkLocalSession = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && sessionInitialized) {
          // Solo verifica si la cookie está inicializada
          try {
            const res = await fetch('/api/verify-session', {
              method: 'GET',
              credentials: 'include', // Incluye cookies
            });

            if (res.ok) {
              const data = await res.json();
              setCurrentUser(data.user || null);
            } else if (res.status === 401) {
              console.warn('Sesión expirada. Cerrando sesión...');
              await auth.signOut(); // Cierra sesión en Firebase
              setCurrentUser(null); // Limpia el estado del usuario
            } else {
              console.warn('Error desconocido con la sesión.');
              setCurrentUser(null);
            }
          } catch (error) {
            console.error('Error verificando la sesión:', error.message);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }

        setAuthLoading(false); // Finaliza la carga
      });

      return () => unsubscribe(); // Limpieza del listener
    };

    checkLocalSession();

    return () => {
      window.removeEventListener('sessionReady', handleSessionReady);
    };
  }, [sessionInitialized]); // Dependemos de `sessionInitialized`

  return (
    <AuthContext.Provider value={{ currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
