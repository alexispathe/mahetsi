// src/app/profile/admin/dashboard/components/CollapsibleSection.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CollapsibleSection = ({
  title,
  color,
  createPath,
  updatePath,
  items,
  itemKey = 'url',
  itemName = 'name'
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={toggleCollapse}
        className={`w-full flex justify-between items-center p-4 ${color} text-white hover:opacity-90 focus:outline-none`}
      >
        <span className="text-xl font-semibold">{title}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          <div className="mb-4">
            <button
              onClick={() => router.push(`${createPath}`)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
            >
              Crear {title.slice(0, -1)}
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-gray-500">No hay {title.toLowerCase()} disponibles.</p>
          ) : (
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item[itemKey]} className="flex justify-between items-center">
                  <span className="text-gray-700">{item[itemName]}</span>
                
                  <button
                    onClick={() => {
                      if (title == 'Subcategorías') {
                        router.push(`${updatePath}/${item.categoryUrl}/${item[itemKey]}`);
                      } else {
                        router.push(`${updatePath}/${item[itemKey]}`);
                      }
                    }}
                    className={`${color} text-white px-3 py-1 rounded hover:opacity-90 transition-colors duration-200`}
                  >
                    Actualizar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
