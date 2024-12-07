'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { products } from '../category/data'; // Ajusta la ruta a tu data si es necesario

export default function FavoritesModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

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
    if (isOpen) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      // Filtramos los productos por los favoritos
      const favProds = products.filter(p => favorites.includes(p.uniqueID));
      setFavoriteProducts(favProds);
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

        {favoriteProducts.length === 0 ? (
          <p className="text-gray-700">No tienes productos en favoritos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoriteProducts.map(product => (
              <Link 
                key={product.uniqueID}
                href={`/product/${product.url}`} 
                className="block bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <img 
                  src={product.images[0]} 
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
