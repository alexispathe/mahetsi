'use client';

import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CartContext } from '@/context/CartContext';
import { toast } from 'react-toastify';

export default function ZipCodeModal({ isOpen, onClose, onZipSaved }) {
  /**
   *  - isOpen: boolean -> muestra u oculta el modal
   *  - onClose: fn -> para cerrar el modal
   *  - onZipSaved: fn opcional -> callback para notificar que se guardó (y abrir cart o lo que quieras)
   */

  const { guestZipCode, saveGuestZipCodeAndFetchQuotes } = useContext(CartContext);
  const [localZip, setLocalZip] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Sincroniza valor local con guestZipCode al abrir
      setLocalZip(guestZipCode || '');
    }
  }, [isOpen, guestZipCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar CP: 5 dígitos numéricos
    if (!/^\d{5}$/.test(localZip)) {
      toast.error('El código postal debe tener exactamente 5 dígitos numéricos.');
      return;
    }

    try {
      // Guardar el CP en localStorage y en el estado global, y de inmediato cotizar
      await saveGuestZipCodeAndFetchQuotes(localZip);

      // Notificar al padre si se desea
      if (onZipSaved) {
        onZipSaved();
      }

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al guardar el CP y cotizar:', error);
      toast.error('Hubo un error al procesar el CP.');
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Ingresa o actualiza tu Código Postal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="zip" className="block text-sm font-medium mb-1">
              Código Postal
            </label>
            <input
              type="text"
              id="zip"
              className="w-full p-2 border border-gray-300 rounded"
              value={localZip}
              onChange={(e) => setLocalZip(e.target.value)}
              placeholder="Ej. 12345"
            />
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Guardar CP
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
