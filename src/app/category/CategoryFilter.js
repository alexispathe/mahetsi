// CategoryFilter.js
// components/CategoryFilter.js
'use client';

import { useRouter } from 'next/navigation';

export default function CategoryFilter({ categories }) {
  const router = useRouter();

  const handleCategorySelect = (categoryURL) => {
    router.push(`/category/${categoryURL}`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Categorías de Productos</h4>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.uniqueID} className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id={category.uniqueID} 
              name="category" 
              className="form-radio h-4 w-4 text-blue-600"
              onChange={() => handleCategorySelect(category.url)}
            />
            <label htmlFor={category.uniqueID} className="text-sm text-gray-700 cursor-pointer">{category.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

