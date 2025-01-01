// src/app/profile/admin/dashboard/components/CollapsibleSection.js
"use client";
import { useState } from "react";

const CollapsibleSection = ({
  title,
  color,
  items,
  itemKey = "url",
  itemName = "name",
  onCreate,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => setIsOpen((prev) => !prev);

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={toggleCollapse}
        className={`w-full flex justify-between items-center p-4 ${color} text-white hover:opacity-90 focus:outline-none transition-colors duration-200`}
      >
        <span className="text-lg font-semibold">{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 bg-gray-50">
          {/* Botón para crear */}
          <div className="mb-4">
            <button
              onClick={() => onCreate?.()}
              className={`flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear {title.slice(0, -1)}
            </button>
          </div>
          {/* Listado */}
          {items.length === 0 ? (
            <p className="text-gray-500">No hay {title.toLowerCase()} disponibles.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                  <span className="text-gray-700">{item[itemName]}</span>
                  <button
                    onClick={() => onUpdate?.(item[itemKey])}
                    className={`${color} text-white px-3 py-1 rounded hover:bg-opacity-90 transition-colors duration-200 flex items-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
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
