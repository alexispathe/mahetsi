'use client'

import { useState } from 'react';

export default function PriceFilter({ onPriceChange }) {
  const [minPrice, setMinPrice] = useState(60);
  const [maxPrice, setMaxPrice] = useState(900);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (name === "min") {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
    onPriceChange(minPrice, maxPrice);
  };

  return (
    <div className="filter-price p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Price</h4>
      <input
        type="range"
        min="0"
        max="1000"
        step="1"
        name="min"
        value={minPrice}
        onChange={handlePriceChange}
        className="slider"
      />
      <input
        type="range"
        min="0"
        max="1000"
        step="1"
        name="max"
        value={maxPrice}
        onChange={handlePriceChange}
        className="slider"
      />
      <div className="flex justify-between text-sm">
        <span>${minPrice}</span>
        <span>${maxPrice}</span>
      </div>
    </div>
  );
}
