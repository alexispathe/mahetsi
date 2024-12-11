// src/components/FavoritesModal.js

'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function FavoritesModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.length === 0) {
          setFavoriteProducts([]);
          setLoading(false);
          return;
        }

        // Firestore limita "in" a 10 elementos, así que dividimos la lista en chunks de 10
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

          const data = await response.json();
          allProducts.push(...data.products);
        }

        setFavoriteProducts(allProducts);
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
  }, [isOpen]);

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
              <Link 
                key={product.uniqueID}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
