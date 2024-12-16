// src/components/FavoritesModal.js

'use client';
import { useEffect, useRef, useState, useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext'; // Importar AuthContext
import { getLocalFavorites, removeFromLocalFavorites } from '@/app/utils/favoritesLocalStorage'; // Importar utilidades de favoritos

export default function FavoritesModal({ isOpen, onClose }) {
  const { currentUser } = useContext(AuthContext); // Obtener el usuario actual desde AuthContext
  const modalRef = useRef(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localFavorites, setLocalFavorites] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        if (currentUser) {
          // Usuario autenticado: obtener favoritos desde la API
          const res = await fetch('/api/favorites/getItems', {
            method: 'GET',
            credentials: 'include', // Incluir credenciales para enviar cookies
            headers: { 'Content-Type': 'application/json' },
          });

          if (!res.ok) {
            if (res.status === 401) {
              setError('Debes iniciar sesión para ver tus favoritos.');
              setFavoriteProducts([]);
              setLoading(false);
              return;
            }
            const data = await res.json();
            throw new Error(data.error || 'Error al obtener los favoritos.');
          }

          const data = await res.json();
          const favorites = data.favorites; // array de uniqueID de los productos favoritos

          if (favorites.length === 0) {
            setFavoriteProducts([]);
            setLoading(false);
            return;
          }

          // Dividir en chunks de 10 para llamar a /api/products/public/get/favorites
          const chunks = [];
          for (let i = 0; i < favorites.length; i += 10) {
            chunks.push(favorites.slice(i, i + 10));
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
        } else {
          // Usuario no autenticado: obtener favoritos desde localStorage
          const localFavs = getLocalFavorites();
          setLocalFavorites(localFavs);

          if (localFavs.length === 0) {
            setFavoriteProducts([]);
            setLoading(false);
            return;
          }

          // Llamar a la API para obtener detalles de productos
          const response = await fetch('/api/products/public/get/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favoriteIDs: localFavs })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener detalles de productos.');
          }

          const enrichedData = await response.json();
          const allProducts = enrichedData.products;

          setFavoriteProducts(allProducts);
        }
      } catch (err) {
        console.error('Error al obtener productos favoritos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchFavoriteProducts();
    }
  }, [isOpen, currentUser]);

  const handleRemoveFavorite = async (uniqueID) => {
    try {
      if (currentUser) {
        // Usuario autenticado: eliminar favorito desde la API
        const res = await fetch('/api/favorites/removeItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Incluir credenciales para enviar cookies
          body: JSON.stringify({ uniqueID })
        });

        if (res.ok) {
          // Actualizar la lista de favoritos
          setFavoriteProducts(prev => prev.filter(p => p.uniqueID !== uniqueID));
        } else {
          const data = await res.json();
          throw new Error(data.error || 'No se pudo eliminar el favorito.');
        }
      } else {
        // Usuario no autenticado: eliminar favorito desde localStorage
        removeFromLocalFavorites(uniqueID);
        setLocalFavorites(prev => prev.filter(id => id !== uniqueID));
        setFavoriteProducts(prev => prev.filter(p => p.uniqueID !== uniqueID));
        alert("Favorito removido (guardado localmente).");
      }
    } catch (err) {
      console.error('Error al eliminar favorito:', err);
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative favorites-modal"
        ref={modalRef}
      >
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Cerrar favoritos"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mis Favoritos</h2>

        {loading ? (
          // Skeleton mientras se cargan los productos
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded-md animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded-md mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : favoriteProducts.length === 0 ? (
          <p className="text-gray-700">No tienes productos en favoritos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <div key={product.uniqueID} className="relative">
                <Link 
                  href={`/product/${product.url}`} 
                  className="block bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mt-2">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(product.uniqueID)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                  aria-label="Eliminar favorito"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
