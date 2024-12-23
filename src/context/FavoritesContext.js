// src/context/FavoritesContext.js
'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { getLocalFavorites, addToLocalFavorites, removeFromLocalFavorites, clearLocalFavorites } from '@/app/utils/favoritesLocalStorage';
import { auth } from '@/libs/firebaseClient'; // Importar auth para usar signOut()

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const [favoriteIDs, setFavoriteIDs] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener los detalles de los productos favoritos a partir de sus IDs
  const fetchFavoriteProducts = async (ids) => {
    if (ids.length === 0) {
      setFavoriteProducts([]);
      return;
    }

    try {
      // Dividir en chunks de 10 para evitar problemas con Firestore
      const chunks = [];
      for (let i = 0; i < ids.length; i += 10) {
        chunks.push(ids.slice(i, i + 10));
      }

      const allProducts = [];

      for (const chunk of chunks) {
        const response = await fetch('/api/products/public/get/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favoriteIDs: chunk }),
        });

        if (!response.ok) {
          // Aquí no se asume directamente 401, pero se podría checar
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

  const loadLocalFavorites = () => {
    const ids = getLocalFavorites();
    setFavoriteIDs(ids);
    fetchFavoriteProducts(ids);
  };

  // Función para cargar favoritos autenticados
  const loadAuthenticatedFavorites = async () => {
    try {
      const res = await fetch('/api/favorites/getItems', {
        method: 'GET',
        credentials: 'include', 
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Sesión no válida
          await auth.signOut();
          // Limpiamos favoritos en el estado para evitar rastro de sesión
          setFavoriteIDs([]);
          setFavoriteProducts([]);
          // Cargar favoritos locales
          loadLocalFavorites();
          return;
        }

        const data = await res.json();
        throw new Error(data.error || 'Error al obtener los favoritos.');
      }

      const data = await res.json();
      const ids = data.favorites;

      // Sincronizar con localStorage si hay ítems
      const localFavs = getLocalFavorites();
      if (localFavs.length > 0) {
        for (const id of localFavs) {
          await addFavorite(id, false); 
        }
        clearLocalFavorites();
      }

      setFavoriteIDs(ids);
      await fetchFavoriteProducts(ids);
    } catch (err) {
      console.error('Error al cargar favoritos autenticados:', err);
      setError(err.message);
    }
  };

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentUser && authLoading === false) {
        await loadAuthenticatedFavorites();
      } else {
        loadLocalFavorites();
      }
    } catch (err) {
      console.error('Error al cargar favoritos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (uniqueID, update = true) => {
    if (currentUser) {
      try {
        const res = await fetch('/api/favorites/addItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ uniqueID }),
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Sesión expirada o no válida
            await auth.signOut();
            // Pasamos a manejo local
            addToLocalFavorites(uniqueID);
            setFavoriteIDs(prev => [...prev, uniqueID]);
            if (update) {
              await fetchFavoriteProducts([...favoriteIDs, uniqueID]);
            }
            return;
          }

          const data = await res.json();
          throw new Error(data.error || 'Error al agregar el favorito.');
        }

        // Si todo ok
        setFavoriteIDs(prev => [...prev, uniqueID]);
        if (update) {
          await fetchFavoriteProducts([...favoriteIDs, uniqueID]);
        }
      } catch (err) {
        console.error('Error al agregar favorito:', err);
        setError(err.message);
      }
    } else {
      addToLocalFavorites(uniqueID);
      setFavoriteIDs(prev => [...prev, uniqueID]);
      if (update) {
        await fetchFavoriteProducts([...favoriteIDs, uniqueID]);
      }
    }
  };

  const removeFavorite = async (uniqueID) => {
    if (currentUser) {
      try {
        const res = await fetch('/api/favorites/removeItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ uniqueID }),
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Sesión expirada
            await auth.signOut();
            // Quitar del local
            removeFromLocalFavorites(uniqueID);
            setFavoriteIDs(prev => prev.filter(id => id !== uniqueID));
            setFavoriteProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
            return;
          }

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
      removeFromLocalFavorites(uniqueID);
      setFavoriteIDs(prev => prev.filter(id => id !== uniqueID));
      setFavoriteProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
    }
  };

  const clearFavorites = () => {
    if (currentUser) {
      // Implementar si deseas limpiar en Firestore
    } else {
      clearLocalFavorites();
      setFavoriteIDs([]);
      setFavoriteProducts([]);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]);

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
