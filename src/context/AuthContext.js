// src/context/AuthContext.jsx
'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/libs/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getLocalCart,
  clearLocalCart,
} from '@/app/utils/cartLocalStorage';
import {
  getLocalFavorites,
  clearLocalFavorites,
} from '@/app/utils/favoritesLocalStorage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Se suscribe a los cambios en el estado de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verificamos si la cookie es válida
          const res = await fetch('/api/verify-session', {
            method: 'GET',
            credentials: 'include',
          });

          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user || null);

            // En este punto podemos sincronizar carrito/favoritos:
            const localCart = getLocalCart();
            const localFavorites = getLocalFavorites();

            if (localCart.length > 0 || localFavorites.length > 0) {
              const syncRes = await fetch('/api/syncItems', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  items: localCart,
                  favorites: localFavorites,
                }),
              });

              if (syncRes.ok) {
                // Limpiar localStorage tras sincronizar
                clearLocalCart();
                clearLocalFavorites();
                console.log('Sincronización exitosa.');
              } else {
                const errorData = await syncRes.json();
                console.error('Error al sincronizar items:', errorData.error);
              }
            }
          } else {
            console.warn('Cookie inválida o sesión no encontrada.');
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error verificando la sesión:', error.message);
          setCurrentUser(null);
        } finally {
          setAuthLoading(false);
        }
      } else {
        // Usuario no logueado (o se cerró sesión)
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
