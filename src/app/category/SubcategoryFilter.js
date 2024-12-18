// components/SubcategoryFilter.js
'use client';

import React from 'react';

export default function SubcategoryFilter({ 
  subcategories, 
  selectedSubcategories, 
  setSelectedSubcategories, 
  isLoadingSubcategories 
}) {
  const handleSubcategoryChange = (subcategoryID) => {
    if (selectedSubcategories.includes(subcategoryID)) {
      setSelectedSubcategories(selectedSubcategories.filter(id => id !== subcategoryID));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategoryID]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Subcategorías</h4>
      {isLoadingSubcategories ? (
        <div className="animate-pulse space-y-4">
          <div className="w-full h-4 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {subcategories.map((subcategory) => (
            <li key={subcategory.uniqueID} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={subcategory.uniqueID}
                name="subcategory"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={selectedSubcategories.includes(subcategory.uniqueID)}
                onChange={() => handleSubcategoryChange(subcategory.uniqueID)}
              />
              <label htmlFor={subcategory.uniqueID} className="text-sm text-gray-700 cursor-pointer">
                {subcategory.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
