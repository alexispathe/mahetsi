// src/app/checkout/TermsModal.js
import React from 'react';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // No renderizar nada si el modal no está abierto.

  // Función para manejar el clic en el fondo
  const handleBackgroundClick = () => {
    onClose();
  };

  // Función para manejar el clic dentro del modal y evitar la propagación
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackgroundClick} // Cerrar el modal al hacer clic en el fondo
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={handleModalClick} // Evitar que los clics dentro del modal cierren el modal
      >
        <h2 className="text-xl font-bold mb-4">Términos y Condiciones</h2>
        <p className="mb-4">
          Aquí van los términos y condiciones de Alpines. Puedes incluir el texto que desees.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
