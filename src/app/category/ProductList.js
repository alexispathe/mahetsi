'use client';
import { useState, useMemo } from 'react';
import { FaTimes } from 'react-icons/fa'; 
import Link from 'next/link'; 
import Pagination from './Pagination'; // Importa el componente
import Image from 'next/image'; // Importa la etiqueta Image

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
  setSelectedSizes,
  loading // Nueva propiedad para indicar que estamos en estado de carga
}) {
  const [sortOption, setSortOption] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Puedes ajustar según tus necesidades

  // Ordenar productos según la opción seleccionada
  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    if (sortOption === 'price: hi low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'price: low hi') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [products, sortOption]);

  const removeFilter = (type, value) => {
    if (type === 'Category') {
      setSelectedCategories(selectedCategories.filter(item => item !== value));
    } else if (type === 'Brand') {
      setSelectedBrands(selectedBrands.filter(item => item !== value));
    } else if (type === 'Type') {
      setSelectedTypes(selectedTypes.filter(item => item !== value));
    } else if (type === 'Size') {
      setSelectedSizes(selectedSizes.filter(s => s !== value));
    }
  };

  const activeFilters = useMemo(() => {
    const filters = [
      ...selectedCategories.map(category => ({ type: 'Category', value: category })),
      ...selectedBrands.map(brand => ({ type: 'Brand', value: brand })),
      ...selectedTypes.map(type => ({ type: 'Type', value: type })),
      ...selectedSizes.map(size => ({ type: 'Size', value: size })),
    ];
    if (minPrice > 0 || maxPrice < 1000) {
      filters.push({ type: 'Price', value: `${minPrice} - ${maxPrice}` });
    }
    return filters;
  }, [selectedCategories, selectedBrands, selectedTypes, selectedSizes, minPrice, maxPrice]);

  // Calcular paginación
  const totalPages = useMemo(() => Math.ceil(sortedProducts.length / productsPerPage), [sortedProducts.length, productsPerPage]);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = useMemo(() => sortedProducts.slice(startIndex, endIndex), [sortedProducts, startIndex, endIndex]);

  const handleSort = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  return (
    <div>
      {/* Header de Filtro y Orden */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Filtros Activos */}
        <div className="flex items-center flex-wrap mb-2 sm:mb-0">
          <span className="mr-2 text-xs text-gray-600">Filtrado por:</span>
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
              Limpiar Todo
            </button>
          )}
        </div>
        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            className="bg-gray-200 px-4 py-2 rounded-md text-xs flex items-center"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            ORDENAR POR 
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
                PRECIO: MAYOR A MENOR
              </button>
              <button
                onClick={() => handleSort('price: low hi')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
              >
                PRECIO: MENOR A MAYOR
              </button>
              <button
                onClick={() => handleSort('name')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
              >
                NOMBRE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton screen
          Array(productsPerPage).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md">
              <div className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                <div className="bg-gray-300 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-300 h-4 w-1/2 mb-2"></div>
                <div className="bg-gray-300 h-4 w-2/3"></div>
              </div>
            </div>
          ))
        ) : (
          currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.uniqueID} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Link href={`/product/${product.url}`} className="block">
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    width={500} 
                    height={500} 
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  {/* Aquí deberías insertar el nombre de la marca y tipo si los tienes disponibles */}
                  {/* Puedes pasarlos como props o procesar los datos previamente */}
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">No se encontraron productos con los filtros seleccionados.</div>
          )
        )}
      </div>

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
}
