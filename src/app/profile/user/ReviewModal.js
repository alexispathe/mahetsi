// src/app/profile/user/ReviewModal.js

'use client';

import { useState } from 'react';
import Modal from './Modal'; 
import { toast } from 'react-toastify';

export default function ReviewModal({ product, orderId, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          productId: product.uniqueID, // Lo que tengas
          productName: product.name,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Reseña guardada correctamente');
        onClose(); // Cerrar el modal
      } else {
        toast.error(data.message || 'Error al guardar la reseña');
      }
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
      toast.error('Error al guardar la reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-4 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Dejar Reseña - {product.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Calificación (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

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
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Guardando...' : 'Guardar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
