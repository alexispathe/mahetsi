// src/hooks/useAdminOrders.js

import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

export const useAdminOrders = (filterStatus) => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const [adminOrders, setAdminOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchAdminOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, authLoading, currentUser]);

  const fetchAdminOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders/admin/get', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        let fetchedOrders = data.orders;

        // Aplicar filtro
        if (filterStatus !== 'todos') {
          fetchedOrders = fetchedOrders.filter(order => order.orderStatus === filterStatus);
        }

        setAdminOrders(fetchedOrders);
      } else {
        setError(data.message || 'Error al obtener las órdenes de admin.');
        toast.error(data.message || 'Error al obtener las órdenes de admin.');
      }
    } catch (err) {
      console.error('Error al obtener las órdenes de admin:', err);
      setError('Error al obtener las órdenes de admin.');
      toast.error('Error al obtener las órdenes de admin.');
    } finally {
      setLoading(false);
    }
  };

  // (Opcional) Función para actualizar la orden desde aquí (si la usaras en AdminOrders.js)
  const updateOrder = async (orderId, trackingNumber, courier, newStatus) => {
    try {
      const res = await fetch('/api/orders/admin/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          trackingNumber,
          courier,
          newStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Actualizamos en el estado
        setAdminOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, ...data.order } : order
          )
        );
        toast.success('Orden actualizada exitosamente.');
      } else {
        throw new Error(data.message || 'Error al actualizar la orden.');
      }
    } catch (err) {
      console.error('Error al actualizar la orden:', err);
      toast.error(err.message || 'Error al actualizar la orden.');
      throw err;
    }
  };

  return {
    adminOrders,
    loading,
    error,
    fetchAdminOrders,
    updateOrder,
  };
};
