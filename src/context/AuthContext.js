'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/libs/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const hasSessionCookie = () => {
      // Verifica si la cookie 'session' existe
      console.log("cookie", document.cookie)
      return document.cookie.split(';').some((item) => item.trim().startsWith('session='));
    };

    const checkLocalSession = async () => {
      // Solo ejecuta la verificación si existe la cookie
      if (hasSessionCookie()) {
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
    };

    // Escucha cambios en el estado de autenticación del cliente
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
      }
    });

    checkLocalSession();

    return () => unsubscribe(); // Limpia el listener
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
