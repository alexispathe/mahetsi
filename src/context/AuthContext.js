// src/context/AuthContext.jsx
'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/libs/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { getLocalCart,  clearLocalCart } from '@/app/utils/cartLocalStorage';
import { getLocalFavorites, clearLocalFavorites } from '@/app/utils/favoritesLocalStorage';
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionInitializing, setSessionInitializing] = useState(false);

  useEffect(() => {
    const checkLocalSession = async () => {
      setSessionInitializing(true);
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

                  // Verificar si hay elementos en el carrito o favoritos
                  const localCart = getLocalCart();
                  const localFavorites = getLocalFavorites();

                  if (localCart.length > 0 || localFavorites.length > 0) {
                    // Llamar al nuevo endpoint de sincronización
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
                      // Limpiar localStorage después de la sincronización exitosa
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
                setSessionInitializing(false);
              }
            }, 3000); // Esperar 3 segundos
          } catch (error) {
            console.error('Error durante la verificación local:', error.message);
            setAuthLoading(false);
            setSessionInitializing(false);
          }
        } else {
          setCurrentUser(null);
          setAuthLoading(false);
          setSessionInitializing(false);
        }
      });

      return () => unsubscribe();
    };

    checkLocalSession();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, sessionInitializing }}>
      {children}
    </AuthContext.Provider>
  );
}
