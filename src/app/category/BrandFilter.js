'use client'

import { useState } from 'react';

export default function BrandFilter() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const brands = ['Adidas', 'Asics', 'Canterbury', 'Colgate', 'Herbalife'];

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="filter-brands p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Brands</h4>
      <ul className="brand-list space-y-2">
        {brands.map((brand, index) => (
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
    </div>
  );
}
