// src/hooks/useSessionCheck.js
//Se encarga de verificar que la sesion exista para renderizar contenido
'use client';
import { createContext, useEffect, useState } from 'react';
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/verify-session', {
          method: 'GET',
          credentials: 'include', // Incluir las cookies
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user || null); // Establecer los datos del usuario
        } else {
          setCurrentUser(null); // Si no está autenticado
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error.message);
        setCurrentUser(null); // En caso de error
      } finally {
        setAuthLoading(false); // Finalizar la carga
      }
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
