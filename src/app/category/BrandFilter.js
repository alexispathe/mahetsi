'use client'

import { useState } from 'react';

export default function BrandFilter() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [searchBrand, setSearchBrand] = useState('');
  const [searchType, setSearchType] = useState('');
  
  const brands = ['Adidas', 'Asics', 'Canterbury', 'Converse', 'Donnay'];
  const types = ['Slip On', 'Strap Up', 'Zip Up', 'Toggle', 'Auto', 'Click'];
  const sizes = ['6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'];

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      {/* Brands */}
      <h4 className="text-lg font-semibold mb-4">Brands</h4>
      <input
        type="text"
        placeholder="Search Brands"
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={searchBrand}
        onChange={(e) => setSearchBrand(e.target.value)}
      />
      <ul className="space-y-2 mb-6">
        {brands.filter(brand => brand.toLowerCase().includes(searchBrand.toLowerCase())).map((brand, index) => (
          <li key={index} className="flex items-center space-x-2 hover:bg-gray-100 rounded-md p-1 cursor-pointer">
            <input
              type="checkbox"
              id={brand}
              onChange={() => toggleBrand(brand)}
              checked={selectedBrands.includes(brand)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={brand} className="text-sm text-gray-700">{brand}</label>
          </li>
        ))}
      </ul>

      {/* Types */}
      <h4 className="text-lg font-semibold mb-4">Type</h4>
      <input
        type="text"
        placeholder="Search Type"
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      />
      <ul className="space-y-2 mb-6">
        {types.filter(type => type.toLowerCase().includes(searchType.toLowerCase())).map((type, index) => (
          <li key={index} className="flex items-center space-x-2 hover:bg-gray-100 rounded-md p-1 cursor-pointer">
            <input
              type="checkbox"
              id={type}
              onChange={() => toggleType(type)}
              checked={selectedTypes.includes(type)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={type} className="text-sm text-gray-700">{type}</label>
          </li>
        ))}
      </ul>

      {/* Sizes */}
      <h4 className="text-lg font-semibold mb-4">Sizes</h4>
      <ul className="grid grid-cols-3 gap-2">
        {sizes.map((size, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={size}
              onChange={() => toggleSize(size)}
              checked={selectedSizes.includes(size)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={size} className="text-sm text-gray-700">{size}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
