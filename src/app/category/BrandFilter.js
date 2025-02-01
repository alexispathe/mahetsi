// BrandFilter.js

'use client';

import { useState, useEffect } from 'react';

export default function BrandFilter({ 
  brands = [],
  types = [],
  selectedBrands = [],
  setSelectedBrands = () => {},
  selectedTypes = [],
  setSelectedTypes = () => {},
}) {
  const [searchBrand, setSearchBrand] = useState('');
  const [searchType, setSearchType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cambia el estado de carga cuando las marcas estén disponibles
    if (brands && brands.length > 0) {
      setLoading(false);
    }
  }, [brands]);

  const toggleBrand = (brandName) => {
    if (selectedBrands.includes(brandName)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brandName));
    } else {
      setSelectedBrands([...selectedBrands, brandName]);
    }
  };

  const toggleType = (typeName) => {
    if (selectedTypes.includes(typeName)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeName));
    } else {
      setSelectedTypes([...selectedTypes, typeName]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      {/* Marcas */}
      <h4 className="text-lg font-semibold mb-4">Marcas</h4>
      {loading ? (
        <div className="animate-pulse mb-4">
          {/* Skeleton: Campo de búsqueda */}
          <div className="w-full h-10 bg-gray-300 rounded-md"></div>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Buscar Marcas"
          className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
        />
      )}

      {loading ? (
        <div className="space-y-2 mb-6 max-h-40 overflow-y-auto animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2 mb-6 max-h-40 overflow-y-auto">
          {brands
            .filter(brand => brand.name.toLowerCase().includes(searchBrand.toLowerCase()))
            .map((brand) => (
              <li key={brand.uniqueID} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={brand.uniqueID}
                  onChange={() => toggleBrand(brand.name)}
                  checked={selectedBrands.includes(brand.name)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <label htmlFor={brand.uniqueID} className="text-sm text-gray-700 cursor-pointer">{brand.name}</label>
              </li>
            ))}
        </ul>
      )}

      {/* Tipos */}
      <h4 className="text-lg font-semibold mb-4">Tipos</h4>
      {loading ? (
        <div className="animate-pulse mb-4">
          {/* Skeleton: Campo de búsqueda */}
          <div className="w-full h-10 bg-gray-300 rounded-md"></div>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Buscar Tipos"
          className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        />
      )}

      {loading ? (
        <div className="space-y-2 mb-6 animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2 mb-6">
          {types
            .filter(type => type.name.toLowerCase().includes(searchType.toLowerCase()))
            .map((type) => (
              <li key={type.uniqueID} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={type.uniqueID}
                  onChange={() => toggleType(type.name)}
                  checked={selectedTypes.includes(type.name)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <label htmlFor={type.uniqueID} className="text-sm text-gray-700 cursor-pointer">{type.name}</label>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
