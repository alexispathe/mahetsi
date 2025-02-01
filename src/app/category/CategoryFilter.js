'use client';
// CategoryFilter.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryFilter({ categories, catURL }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cambia el estado de carga cuando las categorías estén disponibles
    if (categories && categories.length > 0) {
      setLoading(false);
    }
  }, [categories]); // Este hook se activa cuando las categorías cambian

  const handleCategorySelect = (categoryURL) => {
    router.push(`/category/${categoryURL}`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      {/* Título */}
      <h4 className="text-lg font-semibold mb-4">Categorías de Productos</h4>
      {loading ? (
        <div className="animate-pulse space-y-4">
          {/* Skeleton: Solo el título */}
          <div className="w-full h-4 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.uniqueID} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={category.uniqueID} 
                name="category" 
                checked={catURL === category.url}
                className="form-radio h-4 w-4 text-blue-600"
                onChange={() => handleCategorySelect(category.url)}
              />
              <label htmlFor={category.uniqueID} className="text-sm text-gray-700 cursor-pointer">{category.name}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
