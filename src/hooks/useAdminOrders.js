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

        // Aplicar filtro si es necesario
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

  const updateOrder = async (orderId, trackingNumber, courier) => {
    const trackingRegex = /^[A-Za-z0-9]+$/;
    if (!trackingRegex.test(trackingNumber)) {
      throw new Error('El número de guía solo puede contener letras y números.');
    }

    if (courier.trim() === '') {
      throw new Error('La paquetería es requerida.');
    }

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
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Actualizar el estado de las órdenes en el frontend
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
