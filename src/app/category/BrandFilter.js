// src/components/BrandFilter.js
'use client';
import { useState, useEffect } from 'react';
import TypeFilter from './TypeFilter'; // Asegúrate de tener este componente

export default function BrandFilter({ 
  brands, 
  selectedBrands, 
  setSelectedBrands, 
  selectedTypes, 
  setSelectedTypes, 
  selectedSizes, 
  setSelectedSizes,
  categoryID // Nueva prop para obtener categoryID
}) {
  const [searchBrand, setSearchBrand] = useState('');
  const [searchType, setSearchType] = useState('');
  
  // Estados para tipos
  const [types, setTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState(null);

  // Si utilizas tallas en tus productos, define las tallas aquí
  const sizes = ['S', 'M', 'L', 'XL']; // Ejemplo de tallas

  const toggleBrand = (brandID) => {
    if (selectedBrands.includes(brandID)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brandID));
    } else {
      setSelectedBrands([...selectedBrands, brandID]);
    }
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Fetch de types desde la API
  useEffect(() => {
    const fetchTypes = async () => {
      if (!categoryID) return;

      setIsLoadingTypes(true);
      setTypesError(null);

      try {
        const response = await fetch(`/api/types/public/get/byCategory/${categoryID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Categoría no encontrada.');
          } else {
            throw new Error('Error al obtener los tipos.');
          }
        }

        const data = await response.json();
        setTypes(data.types);
      } catch (error) {
        console.error('Error al obtener los tipos:', error);
        setTypesError(error.message);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchTypes();
  }, [categoryID]);

  const toggleType = (typeID) => {
    if (selectedTypes.includes(typeID)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeID));
    } else {
      setSelectedTypes([...selectedTypes, typeID]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      {/* Marcas */}
      <h4 className="text-lg font-semibold mb-4">Marcas</h4>
      <input
        type="text"
        placeholder="Buscar Marcas"
        className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
        value={searchBrand}
        onChange={(e) => setSearchBrand(e.target.value)}
      />
      <ul className="space-y-2 mb-6 max-h-40 overflow-y-auto">
        {brands
          .filter(brand => brand.name.toLowerCase().includes(searchBrand.toLowerCase()))
          .map((brand) => (
            <li key={brand.uniqueID} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={brand.uniqueID}
                onChange={() => toggleBrand(brand.uniqueID)}
                checked={selectedBrands.includes(brand.uniqueID)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <label htmlFor={brand.uniqueID} className="text-sm text-gray-700 cursor-pointer">{brand.name}</label>
            </li>
          ))}
      </ul>

      {/* Tipos */}
      <h4 className="text-lg font-semibold mb-4">Tipos</h4>
      <input
        type="text"
        placeholder="Buscar Tipos"
        className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      />
      {isLoadingTypes ? (
        <div className="text-gray-600">Cargando tipos...</div>
      ) : typesError ? (
        <div className="text-red-500">Error: {typesError}</div>
      ) : (
        <TypeFilter 
          types={types.filter(type => type.name.toLowerCase().includes(searchType.toLowerCase()))}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
      )}

      {/* Tallas */}
      <h4 className="text-lg font-semibold mb-4">Tallas</h4>
      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {sizes.map((size, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`size-${size}`}
              onChange={() => toggleSize(size)}
              checked={selectedSizes.includes(size)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={`size-${size}`} className="text-sm text-gray-700 cursor-pointer">{size}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
