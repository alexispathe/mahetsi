'use client';

import React, { useState, useEffect } from 'react';
import { Range } from 'react-range';

export default function PriceFilter({ minPrice, maxPrice, onPriceChange }) {
  const [values, setValues] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setValues([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleChange = (newValues) => {
    setValues(newValues);
    onPriceChange(newValues[0], newValues[1]);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Precio</h4>
      <Range
        step={1}
        min={0}
        max={1000}
        values={values}
        onChange={handleChange}
        renderTrack={({ props, children }) => {
          const { key, ...trackProps } = props;
          return (
            <div
              {...trackProps}
              style={{
                ...trackProps.style,
                height: '5px',
                width: '100%',
                backgroundColor: '#ddd',
                position: 'relative',
                borderRadius: '5px',
              }}
              key={key}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => {
          const { key, ...thumbProps } = props;
          return (
            <div
              {...thumbProps}
              style={{
                ...thumbProps.style,
                height: '20px',
                width: '20px',
                backgroundColor: '#1c1f28',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 2,
              }}
              key={key}
            />
          );
        }}
      />
      <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-4 sm:space-y-0">
        <div className="flex items-center border border-gray-300 rounded-md">
          <span className="px-2 text-sm">$</span>
          <input
            type="number"
            name="min"
            value={values[0]}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), values[1] - 10);
              setValues([value, values[1]]);
              onPriceChange(value, values[1]);
            }}
            className="w-full p-2 outline-none text-sm"
            min="0"
            max="1000"
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-md">
          <span className="px-2 text-sm">$</span>
          <input
            type="number"
            name="max"
            value={values[1]}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), values[0] + 10);
              setValues([values[0], value]);
              onPriceChange(values[0], value);
            }}
            className="w-full p-2 outline-none text-sm"
            min="0"
            max="1000"
          />
        </div>
      </div>
    </div>
  );
}
