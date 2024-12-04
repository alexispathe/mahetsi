'use client'
import { useState } from 'react';

export default function ProductList({ products }) {
  const [selectedFilter, setSelectedFilter] = useState('Slip On');
  const [sortOption, setSortOption] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false); // Estado para controlar la visibilidad del menú de orden

  const handleSort = (option) => {
    setSortOption(option);
    setIsSortOpen(false); // Cierra el menú después de seleccionar una opción
    // Lógica para ordenar productos (puedes implementarla después)
  };

  const clearFilters = () => {
    setSelectedFilter('');
    // Lógica para limpiar filtros (puedes implementarla después)
  };

  return (
    <div>
      {/* Header de Filtro y Orden */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Filtros Activos */}
        <div className="flex items-center mb-2 sm:mb-0">
          <span className="mr-2 text-xs text-gray-600">Filtered by:</span>
          {selectedFilter && (
            <span className="flex items-center bg-gray-200 px-2 py-1 rounded-md mr-2 text-xs">
              Type: {selectedFilter} 
              <button
                onClick={() => setSelectedFilter('')}
                className="ml-1 text-red-500 font-bold text-xs"
                aria-label="Remove filter"
              >
                ×
              </button>
            </span>
          )}
          <button 
            onClick={clearFilters} 
            className="text-blue-500 underline text-xs"
          >
            Clear All
          </button>
        </div>
        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            className="bg-gray-200 px-4 py-2 rounded-md text-xs flex items-center"
            onClick={() => setIsSortOpen(!isSortOpen)} // Cambiar el estado para abrir/cerrar el menú
          >
            SORT BY 
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isSortOpen && ( // Mostrar el menú solo si isSortOpen es true
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md">
              <button
                onClick={() => handleSort('price: hi low')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
              >
                PRICE: HI LOW
              </button>
              <button
                onClick={() => handleSort('price: low hi')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
              >
                PRICE: LOW HI
              </button>
              <button
                onClick={() => handleSort('name')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
              >
                NAME
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded-md" />
            <h4 className="text-sm font-semibold text-gray-800">{product.name}</h4>
            <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
