// src/profile/admin/UpdateShippingModal.js

import React from 'react';
import Modal from '../user/Modal';

export default function UpdateShippingModal({
  order,
  trackingNumber,
  setTrackingNumber,
  courier,
  setCourier,
  handleUpdateSubmit,
  updateError,
  updating,
  onClose
}) {
  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-4">Actualizar Envío de la Orden {order.uniqueID}</h3>
        <form onSubmit={handleUpdateSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Guía
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paquetería
            </label>
            <input
              type="text"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {updateError && <p className="text-red-500 mb-4">{updateError}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updating}
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition ${updating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {updating ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}