// src/app/profile/user/UserReviews.js
'use client';

import { useState, useEffect } from 'react';

export default function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const res = await fetch('/api/reviews/user', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();

      if (res.ok) {
        setReviews(data.reviews);
      } else {
        setError(data.message || 'Error al obtener las reseñas');
      }
    } catch (err) {
      console.error('Error al obtener las reseñas:', err);
      setError('Error al obtener las reseñas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando reseñas...</p>;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-gray-600">Aún no has dejado ninguna reseña.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Mis Reseñas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comentario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {rev.productName || rev.productId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {rev.rating} / 5
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {rev.comment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleString('es-MX') : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
