// src/context/FavoritesContext.js

'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { getLocalFavorites, addToLocalFavorites, removeFromLocalFavorites, clearLocalFavorites } from '@/app/utils/favoritesLocalStorage';
import { auth } from '@/libs/firebaseClient'; // Importar Firebase Auth

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [favoriteIDs, setFavoriteIDs] = useState([]); // Lista de uniqueIDs de favoritos
  const [favoriteProducts, setFavoriteProducts] = useState([]); // Detalles de productos favoritos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener los detalles de los productos a partir de los favoriteIDs
  const fetchFavoriteProducts = async (ids) => {
    if (ids.length === 0) {
      setFavoriteProducts([]);
      return;
    }

    try {
      // Dividir en chunks de 10 para cumplir con las limitaciones de Firestore
      const chunks = [];
      for (let i = 0; i < ids.length; i += 10) {
        chunks.push(ids.slice(i, i + 10));
      }

      const allProducts = [];

      for (const chunk of chunks) {
        const response = await fetch('/api/products/public/get/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ favoriteIDs: chunk }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener productos favoritos.');
        }

        const chunkData = await response.json();
        allProducts.push(...chunkData.products);
      }

      setFavoriteProducts(allProducts);
    } catch (err) {
      console.error('Error al obtener productos favoritos:', err);
      setError(err.message);
    }
  };

  // Función para cargar los favoritos al iniciar o al cambiar el usuario
  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      let ids = [];

      if (currentUser) {
        // Usuario autenticado: obtener favoritos desde la API
        const res = await fetch('/api/favorites/getItems', {
          method: 'GET',
          credentials: 'include', // Incluir credenciales para enviar cookies
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError('La sesión ha expirado, por favor inicia sesión nuevamente.');
            setFavoriteIDs([]);
            setFavoriteProducts([]);
            setLoading(false);
            await handleSignOut(); // Cerrar sesión en Firebase sin redirigir
            return;
          }
          const data = await res.json();
          throw new Error(data.error || 'Error al obtener los favoritos.');
        }

        const data = await res.json();
        ids = data.favorites; // array de uniqueID de los productos favoritos

        // Sincronizar con localStorage si hay ítems
        const localFavs = getLocalFavorites();
        if (localFavs.length > 0) {
          for (const id of localFavs) {
            await addFavorite(id, false); // false indica que no se desea actualizar aquí
          }
          clearLocalFavorites();
        }
      } else {
        // Usuario no autenticado: obtener favoritos desde localStorage
        ids = getLocalFavorites();
      }

      setFavoriteIDs(ids);
      await fetchFavoriteProducts(ids);
    } catch (err) {
      console.error('Error al cargar favoritos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión en Firebase sin redirigir
  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Cerrar sesión de Firebase
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Método para agregar un producto a favoritos
  const addFavorite = async (uniqueID, update = true) => {
    if (currentUser) {
      // Usuario autenticado: agregar favorito vía API
      try {
        const res = await fetch('/api/favorites/addItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Incluir credenciales para enviar cookies
          body: JSON.stringify({ uniqueID }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al agregar el favorito.');
        }

        setFavoriteIDs(prev => [...prev, uniqueID]);
        if (update) {
          await fetchFavoriteProducts([...favoriteIDs, uniqueID]);
        }
      } catch (err) {
        console.error('Error al agregar favorito:', err);
        setError(err.message);
      }
    } else {
      // Usuario no autenticado: agregar favorito en localStorage
      addToLocalFavorites(uniqueID);
      setFavoriteIDs(prev => [...prev, uniqueID]);
      if (update) {
        await fetchFavoriteProducts([...favoriteIDs, uniqueID]);
      }
    }
  };

  // Método para eliminar un producto de favoritos
  const removeFavorite = async (uniqueID) => {
    if (currentUser) {
      // Usuario autenticado: eliminar favorito vía API
      try {
        const res = await fetch('/api/favorites/removeItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Incluir credenciales para enviar cookies
          body: JSON.stringify({ uniqueID }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al eliminar el favorito.');
        }

        setFavoriteIDs(prev => prev.filter(id => id !== uniqueID));
        setFavoriteProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
      } catch (err) {
        console.error('Error al eliminar favorito:', err);
        setError(err.message);
      }
    } else {
      // Usuario no autenticado: eliminar favorito desde localStorage
      removeFromLocalFavorites(uniqueID);
      setFavoriteIDs(prev => prev.filter(id => id !== uniqueID));
      setFavoriteProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
    }
  };

  // Método para limpiar todos los favoritos (opcional)
  const clearFavorites = () => {
    if (currentUser) {
      // Implementa la lógica para limpiar los favoritos en la base de datos si es necesario
    } else {
      clearLocalFavorites();
      setFavoriteIDs([]);
      setFavoriteProducts([]);
    }
  };

  // Cargar los favoritos al montar o al cambiar el usuario
  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Cálculo de favoriteCount usando useMemo para optimización
  const favoriteCount = useMemo(() => {
    return favoriteIDs.length;
  }, [favoriteIDs]);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIDs,
        favoriteProducts,
        loading,
        error,
        addFavorite,
        removeFavorite,
        clearFavorites,
        favoriteCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
