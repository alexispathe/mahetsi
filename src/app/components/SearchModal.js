'use client'

import { useEffect, useState } from "react";
import Link from 'next/link';
import { products, categories, subcategories } from "../category/data"; // Ajusta la ruta si es necesario

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    // Filtrado de productos
    // Compararemos el query con el nombre del producto, su descripción,
    // el nombre de su categoría y el de su subcategoría.
    const results = products.filter((p) => {
      const productName = p.name.toLowerCase();
      const productDesc = p.description.toLowerCase();

      const categoryName = categories.find(cat => cat.uniqueID === p.categoryID)?.name?.toLowerCase() || '';
      const subcategoryName = subcategories.find(sub => sub.uniqueID === p.subcategoryID)?.name?.toLowerCase() || '';

      return (
        productName.includes(query) ||
        productDesc.includes(query) ||
        categoryName.includes(query) ||
        subcategoryName.includes(query)
      );
    });

    setFiltered(results);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="search-modal bg-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg text-gray-600 hover:text-gray-900"
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
        />
        
        {searchQuery && (
          <div className="text-sm mb-4">
            <span>{filtered.length} resultado(s) para {searchQuery}</span>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((product) => (
            <Link 
              key={product.uniqueID} 
              href={`/product/${product.url}`}
              className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>¿No encontraste lo que buscabas? <a href="#" className="text-blue-600">Envíanos un mensaje.</a></p>
        </div>
      </div>
    </div>
  );
}
