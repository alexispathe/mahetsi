'use client'
import '../styles/productList.css'
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
      <div className="filter-bar flex justify-between items-center mb-4">
        <div className="filters flex items-center">
          <span className="mr-2 text-xs">Filtered by:</span>
          {selectedFilter && (
            <span className="filter-tag bg-gray-200 px-2 py-1 rounded-md mr-2 text-xs">
              Type: {selectedFilter} 
              <button
                onClick={() => setSelectedFilter('')}
                className="ml-1 text-red-500 font-bold text-xs"
              >
                ×
              </button>
            </span>
          )}
          <button onClick={clearFilters} className="text-blue-500 underline text-xs">
            Clear All
          </button>
        </div>
        <div className="sort-dropdown relative">
          <button 
            className="sort-button bg-gray-200 px-4 py-2 rounded-md text-xs"
            onClick={() => setIsSortOpen(!isSortOpen)} // Cambiar el estado para abrir/cerrar el menú
          >
            SORT BY ▼
          </button>
          {isSortOpen && ( // Mostrar el menú solo si isSortOpen es true
            <div className="sort-options absolute bg-white shadow-md rounded-md mt-2">
              <button
                onClick={() => handleSort('price: hi low')}
                className="block px-4 py-2 hover:bg-gray-100 text-xs"
              >
                PRICE: HI LOW
              </button>
              <button
                onClick={() => handleSort('price: low hi')}
                className="block px-4 py-2 hover:bg-gray-100 text-xs"
              >
                PRICE: LOW HI
              </button>
              <button
                onClick={() => handleSort('name')}
                className="block px-4 py-2 hover:bg-gray-100 text-xs"
              >
                NAME
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="product-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index} className="product-item bg-white p-4 rounded-lg shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded-md" />
            <h4 className="text-sm font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-500">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
