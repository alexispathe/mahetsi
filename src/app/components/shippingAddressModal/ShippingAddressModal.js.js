'use client';

import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import ShippingAddressForm from './ShippingAddressForm';
import { CartContext } from '@/context/CartContext/CartContext';

export default function ShippingAddressModal({ isOpen, onClose }) {
  const { shippingAddress, saveShippingAddress } = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null; // Si no está abierto, no renderizamos nada

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Cierra el modal al hacer clic fuera del contenido
    >
      <div
        className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-screen"
        onClick={(e) => e.stopPropagation()} // Detiene la propagación del clic
      >
        <h2 className="text-2xl font-bold mb-4">
          {shippingAddress ? 'Editar Dirección de Envío' : 'Agregar Dirección de Envío'}
        </h2>

        {/* Formulario de dirección */}
        <ShippingAddressForm
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          shippingAddress={shippingAddress}
          saveShippingAddress={saveShippingAddress}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  );
}
