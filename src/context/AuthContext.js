'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/libs/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/verify-session', {
          method: 'GET',
          credentials: 'include', // Incluye cookies
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user || null); // Establecer los datos del usuario
        } else {
          setCurrentUser(null); // Si no está autenticado
        }
      } catch (error) {
        console.error('Error verificando la sesión:', error.message);
        setCurrentUser(null); // En caso de error
      } finally {
        setAuthLoading(false); // Finalizar la carga
      }
    };

    // Verificar sesión en el cliente
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkSession(); // Verifica si la cookie existe y es válida
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe(); // Limpieza del listener
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
