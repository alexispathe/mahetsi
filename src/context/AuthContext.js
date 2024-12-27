// src/context/AuthContext.jsx
'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/libs/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionInitializing, setSessionInitializing] = useState(false); // Nuevo estado

  useEffect(() => {
    const checkLocalSession = async () => {
      setSessionInitializing(true); // Inicia la inicialización
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Esperar un tiempo antes de verificar la cookie
            setTimeout(async () => {
              try {
                const res = await fetch('/api/verify-session', {
                  method: 'GET',
                  credentials: 'include', // Incluye cookies
                });

                if (res.ok) {
                  const data = await res.json();
                  setCurrentUser(data.user || null);
                } else {
                  console.warn('Cookie inválida o sesión no encontrada.');
                  setCurrentUser(null);
                }
              } catch (error) {
                console.error('Error verificando la sesión:', error.message);
                setCurrentUser(null);
              } finally {
                setAuthLoading(false); // Finaliza la carga
                setSessionInitializing(false); // Finaliza la inicialización
              }
            }, 1000); // Esperar 1 segundo
          } catch (error) {
            console.error('Error durante la verificación local:', error.message);
          }
        } else {
          setCurrentUser(null);
          setAuthLoading(false);
          setSessionInitializing(false); // Finaliza la inicialización
        }
      });

      return () => unsubscribe(); // Limpia el listener
    };

    checkLocalSession();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, sessionInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}
