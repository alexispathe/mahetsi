// src/components/FavoritesModal.js

'use client';

import { useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { FavoritesContext } from '@/context/FavoritesContext'; // Asegúrate de que la ruta sea correcta
import { FaTimes } from 'react-icons/fa'; // Icono para cerrar
import Image from 'next/image'; // Para optimizar imágenes

export default function FavoritesModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  // Consumir el contexto de favoritos
  const {
    favoriteProducts,
    loading,
    error,
    removeFavorite,
  } = useContext(FavoritesContext);

  // Verificar que el contexto esté definido
  if (!favoriteProducts && !loading && !error) {
    console.error('FavoritesContext no está siendo proporcionado correctamente.');
  }

  // Cerrar el modal al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // No renderizar nada si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative favorites-modal"
        ref={modalRef}
      >
        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Cerrar favoritos"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mis Favoritos</h2>

        {loading ? (
          // Skeleton loader mientras se cargan los productos
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-md animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
                  <div className="w-3/4 h-4 bg-gray-300 rounded-md mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-300 rounded-md"></div>
                </div>
              ))}
          </div>
        ) : error ? (
          // Mostrar mensaje de error si existe
          <p className="text-red-500">Error: {error}</p>
        ) : favoriteProducts.length === 0 ? (
          // Mensaje si no hay productos favoritos
          <p className="text-gray-700">No tienes productos en favoritos.</p>
        ) : (
          // Mostrar lista de productos favoritos
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <div key={product.uniqueID} className="relative">
                <Link
                  href={`/product/${product.url}`}
                  className="block bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Optimizar imágenes con next/image */}
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mt-2">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
                {/* Botón para eliminar de favoritos */}
                <button
                  onClick={() => removeFavorite(product.uniqueID)}
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
