// BrandFilter.js
'use client';
import { useState } from 'react';

export default function BrandFilter({ 
  brands, 
  types, 
  selectedBrands, 
  setSelectedBrands, 
  selectedTypes, 
  setSelectedTypes, 
  selectedSizes, 
  setSelectedSizes 
}) {
  const [searchBrand, setSearchBrand] = useState('');
  const [searchType, setSearchType] = useState('');
  
  // Si utilizas tallas en tus productos, define las tallas aquí
  const sizes = ['S', 'M', 'L', 'XL']; // Ejemplo de tallas
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

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
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
