// src/components/ZipCodeModal.jsx
'use client';

import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CartContext } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

export default function ZipCodeModal({ isOpen, onClose, onZipSaved }) {
  const { guestZipCode, saveGuestZipCodeAndFetchQuotes } = useContext(CartContext);
  const [localZip, setLocalZip] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
      setIsSaving(true);

      // Guardar CP y de inmediato cotizar
      await saveGuestZipCodeAndFetchQuotes(localZip);

      if (onZipSaved) {
        onZipSaved();
      }

      toast.success('Código postal guardado y cotización realizada correctamente.');
      onClose();
    } catch (error) {
      console.error('Error al guardar CP y cotizar:', error);
      toast.error('Hubo un error al procesar el CP.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Cierra el modal al hacer clic fuera del contenido
    >
      <div
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Detiene la propagación del clic
      >
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
              disabled={isSaving}
            />
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className={`flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 ${
                isSaving ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Cotizando...
                </>
              ) : (
                'Guardar CP'
              )}
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
              onClick={onClose}
              disabled={isSaving}
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
