'use client';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Importar ícono de cierre
import Link from 'next/link'; // Importar Link de Next.js

export default function ProductList({ 
  products, 
  selectedCategories,
  selectedBrands,
  selectedTypes,
  selectedSizes,
  minPrice,
  maxPrice,
  clearAllFilters,
  setSelectedCategories,
  setSelectedBrands,
  setSelectedTypes,
  setSelectedSizes
}) {
  const [sortOption, setSortOption] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false); // Estado para controlar la visibilidad del menú de orden

  const handleSort = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
    // Aquí puedes implementar la lógica de ordenamiento si lo deseas
  };

  // Ordenar los productos según la opción seleccionada
  const sortedProducts = [...products];
  if (sortOption === 'price: hi low') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'price: low hi') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'name') {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Función para eliminar un filtro específico
  const removeFilter = (type, value) => {
    if (type === 'Category') {
      setSelectedCategories(selectedCategories.filter(item => item !== value));
    } else if (type === 'Brand') {
      setSelectedBrands(selectedBrands.filter(item => item !== value));
    } else if (type === 'Type') {
      setSelectedTypes(selectedTypes.filter(item => item !== value));
    } else if (type === 'Size') {
      setSelectedSizes(selectedSizes.filter(item => item !== value));
    } else if (type === 'Price') {
      // Opcional: puedes restablecer el rango de precios a valores predeterminados
      // setMinPrice(60);
      // setMaxPrice(900);
    }
  };

  // Preparar los filtros activos para mostrar
  const activeFilters = [
    ...selectedCategories.map(category => ({ type: 'Category', value: category })),
    ...selectedBrands.map(brand => ({ type: 'Brand', value: brand })),
    ...selectedTypes.map(type => ({ type: 'Type', value: type })),
    ...selectedSizes.map(size => ({ type: 'Size', value: size })),
  ];

  // Agregar el filtro de precio si está dentro de un rango
  if (minPrice > 0 || maxPrice < 1000) {
    activeFilters.push({ type: 'Price', value: `${minPrice} - ${maxPrice}` });
  }

  return (
    <div>
      {/* Header de Filtro y Orden */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Filtros Activos */}
        <div className="flex items-center flex-wrap mb-2 sm:mb-0">
          <span className="mr-2 text-xs text-gray-600">Filtered by:</span>
          {activeFilters.map((filter, index) => (
            <span key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded-md mr-2 mb-2">
              <span className="text-xs">{filter.type}: {filter.value}</span>
              <button
                onClick={() => removeFilter(filter.type, filter.value)}
                className="ml-1 text-red-500 font-bold text-xs"
                aria-label={`Remove ${filter.type} filter`}
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </span>
          ))}
          {activeFilters.length > 0 && (
            <button 
              onClick={clearAllFilters} 
              className="text-blue-500 underline text-xs"
            >
              Clear All
            </button>
          )}
        </div>
        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            className="bg-gray-200 px-4 py-2 rounded-md text-xs flex items-center"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            SORT BY 
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isSortOpen && (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link href={`/product`} className="block">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover mb-4 rounded-md"  // Ajustamos para que la imagen ocupe el 100% del contenedor
              />
              <h4 className="text-sm sm:text-base font-semibold text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
