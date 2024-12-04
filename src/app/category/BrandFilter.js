'use client';
import { useState } from 'react';

export default function BrandFilter({ 
  selectedBrands, 
  setSelectedBrands, 
  selectedTypes, 
  setSelectedTypes, 
  selectedSizes, 
  setSelectedSizes 
}) {
  const [searchBrand, setSearchBrand] = useState('');
  const [searchType, setSearchType] = useState('');
  
  const brands = ['Adidas', 'Asics', 'Canterbury', 'Converse', 'Donnay'];
  const types = ['Slip On', 'Strap Up', 'Zip Up', 'Toggle', 'Auto', 'Click'];
  const sizes = ['6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'];

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
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
      {/* Brands */}
      <h4 className="text-lg font-semibold mb-4">Marcas</h4>
      <input
        type="text"
        placeholder="Buscar Marcas"
        className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
        value={searchBrand}
        onChange={(e) => setSearchBrand(e.target.value)}
      />
      <ul className="space-y-2 mb-6">
        {brands.filter(brand => brand.toLowerCase().includes(searchBrand.toLowerCase())).map((brand, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={brand}
              onChange={() => toggleBrand(brand)}
              checked={selectedBrands.includes(brand)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={brand} className="text-sm text-gray-700 cursor-pointer">{brand}</label>
          </li>
        ))}
      </ul>

      {/* Types */}
      <h4 className="text-lg font-semibold mb-4">Tipos</h4>
      <input
        type="text"
        placeholder="Buscar Tipos"
        className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      />
      <ul className="space-y-2 mb-6">
        {types.filter(type => type.toLowerCase().includes(searchType.toLowerCase())).map((type, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={type}
              onChange={() => toggleType(type)}
              checked={selectedTypes.includes(type)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">{type}</label>
          </li>
        ))}
      </ul>

      {/* Sizes */}
      <h4 className="text-lg font-semibold mb-4">Tallas</h4>
      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {sizes.map((size, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={size}
              onChange={() => toggleSize(size)}
              checked={selectedSizes.includes(size)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={size} className="text-sm text-gray-700 cursor-pointer">{size}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
