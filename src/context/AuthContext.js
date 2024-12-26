'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/libs/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkLocalSession = async () => {
      // Verificar si hay un usuario autenticado en el cliente
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Si hay un usuario, verificar la cookie en el servidor
          try {
            const res = await fetch('/api/verify-session', {
              method: 'GET',
              credentials: 'include', // Incluye cookies
            });

            if (res.ok) {
              const data = await res.json();
              setCurrentUser(data.user || null);
            } else {
              setCurrentUser(null); // Si la cookie no es válida
            }
          } catch (error) {
            setCurrentUser(null);
          }
        } else {
          // Si no hay un usuario autenticado en Firebase
          setCurrentUser(null);
        }

        setAuthLoading(false); // Finaliza la carga
      });

      return () => unsubscribe(); // Limpieza del listener
    };

    checkLocalSession();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
