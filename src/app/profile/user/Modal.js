// src/user/Modal.js

'use client';

import { useEffect } from 'react';

export default function Modal({ children, onClose }) {
  // Cerrar el modal al presionar la tecla ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full sm:w-full md:w-11/12 lg:w-9/12 xl:w-9/12 max-h-screen overflow-y-auto relative mb-10"> {/* Agregamos 'mb-10' para espacio en la parte inferior */}
        {/* Botón de Cerrar en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Contenido del Modal */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
