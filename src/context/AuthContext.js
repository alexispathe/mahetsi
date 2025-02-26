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
    // Se suscribe a los cambios en el estado de autenticación de Firebase.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verificar la cookie de sesión en el servidor.
          const res = await fetch('/api/verify-session', {
            method: 'GET',
            credentials: 'include',
          });

          if (res.ok) {
            const data = await res.json();

            // Si se incluye el campo 'exp' en la respuesta, se revisa la proximidad de la expiración.
            if (data.exp) {
              const tiempoRestante = data.exp * 1000 - Date.now();
              // Si quedan menos de 5 minutos, se intenta renovar la sesión.
              if (tiempoRestante < 5 * 60 * 1000) {
                try {
                  const newIdToken = await user.getIdToken(true);
                  const renewRes = await fetch('/api/renew-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ idToken: newIdToken }),
                  });
                  if (renewRes.ok) {
                    console.log('Sesión renovada exitosamente');
                  } else {
                    console.error('Fallo en la renovación de sesión');
                  }
                } catch (renewError) {
                  console.error('Error al renovar la sesión:', renewError.message);
                }
              }
            }

            setCurrentUser(data.user || null);

            // Sincronización de carrito y favoritos.
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
                clearLocalCart();
                clearLocalFavorites();
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
        // Usuario no logueado o se cerró sesión.
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
