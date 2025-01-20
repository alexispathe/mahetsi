// src/components/SearchModal.js
'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image'; // Importar Image de Next.js

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(isOpen); // Controla la visibilidad del modal
  const [animation, setAnimation] = useState(''); // Controla la animación actual

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimation('animate-fadeIn');
    } else if (visible) {
      setAnimation('animate-fadeOut');
      // Espera a que termine la animación antes de ocultar el modal
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1000); // 1000ms = 1 segundo

      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  useEffect(() => {
    let abort = false;
    const fetchData = async () => {
      if (!searchQuery.trim()) {
        setFiltered([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/products/public/get/search?search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (!abort) {
          setFiltered(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        if (!abort) {
          setFiltered([]);
        }
      } finally {
        if (!abort) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => { abort = true; };
  }, [searchQuery]);

  // Cerrar el modal al hacer clic fuera
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (event.target.closest(".search-modal") === null) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${animation}`}>
      <div className="search-modal bg-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative flex flex-col max-h-screen">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg text-gray-600 hover:text-gray-900"
          aria-label="Cerrar búsqueda"
        >
          ❌
        </button>
        
        <h2 className="text-xl font-semibold mb-4">¿Qué estás buscando?</h2>
        
        <input
          type="text"
          placeholder="Busca por producto, categoría, subcategoría o descripción..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Campo de búsqueda"
        />
        
        {searchQuery && (
          <div className="text-sm mb-4">
            <span>{filtered.length} resultado(s) para {searchQuery}</span>
          </div>
        )}

        {/* Contenedor desplazable para los productos */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {loading ? (
            // Skeleton de productos
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filtered.map((product) => (
              <Link 
                key={product.uniqueID} 
                href={`/product/${product.url}`}
                className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                    width={64} // Especificar el ancho
                    height={64} // Especificar el alto
                  />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price?.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>¿No encontraste lo que buscabas? <a href="#" className="text-blue-600">Envíanos un mensaje.</a></p>
        </div>
      </div>
    </div>
  );
}
