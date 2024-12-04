'use client'

import { useState } from 'react';
import '../styles/brandFilter.css';

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
    <div className="filter-brands p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Brands</h4>
      <input
        type="text"
        placeholder="Search Brands"
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={searchBrand}
        onChange={(e) => setSearchBrand(e.target.value)}
      />
      <ul className="brand-list space-y-2">
        {brands.filter(brand => brand.toLowerCase().includes(searchBrand.toLowerCase())).map((brand, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={brand}
              onChange={() => toggleBrand(brand)}
              checked={selectedBrands.includes(brand)}
            />
            <label htmlFor={brand} className="text-sm">{brand}</label>
          </li>
        ))}
      </ul>

      <h4 className="text-lg font-semibold mb-4 mt-6">Type</h4>
      <input
        type="text"
        placeholder="Search Type"
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      />
      <ul className="brand-list space-y-2">
        {types.filter(type => type.toLowerCase().includes(searchType.toLowerCase())).map((type, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={type}
              onChange={() => toggleType(type)}
              checked={selectedTypes.includes(type)}
            />
            <label htmlFor={type} className="text-sm">{type}</label>
          </li>
        ))}
      </ul>

      <h4 className="text-lg font-semibold mb-4 mt-6">Sizes</h4>
      <ul className="brand-list grid grid-cols-4 gap-2">
        {sizes.map((size, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={size}
              onChange={() => toggleSize(size)}
              checked={selectedSizes.includes(size)}
            />
            <label htmlFor={size} className="text-sm">{size}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
