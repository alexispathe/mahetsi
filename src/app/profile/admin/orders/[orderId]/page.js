// src/app/profile/admin/orders/[orderId]/page.js

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaShippingFast, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from '../../../user/Modal';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/admin/get/${orderId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Error al obtener los detalles de la orden.');
        toast.error(data.message || 'Error al obtener los detalles de la orden.');
      }
    } catch (err) {
      console.error('Error al obtener los detalles de la orden:', err);
      setError('Error al obtener los detalles de la orden.');
      toast.error('Error al obtener los detalles de la orden.');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
    setTrackingNumber('');
    setCourier('');
    setUpdateError(null);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setTrackingNumber('');
    setCourier('');
    setUpdateError(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const trackingRegex = /^[A-Za-z0-9]+$/;
    if (!trackingRegex.test(trackingNumber)) {
      setUpdateError('El número de guía solo puede contener letras y números.');
      return;
    }

    if (courier.trim() === '') {
      setUpdateError('La paquetería es requerida.');
      return;
    }

    setUpdating(true);
    setUpdateError(null);

    try {
      const res = await fetch('/api/orders/admin/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId: order.id,
          trackingNumber,
          courier,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Actualizar el estado de la orden en el frontend
        setOrder({ ...order, ...data.order });
        toast.success('Orden actualizada exitosamente.');
        closeUpdateModal();
      } else {
        setUpdateError(data.message || 'Error al actualizar la orden.');
        toast.error(data.message || 'Error al actualizar la orden.');
      }
    } catch (err) {
      console.error('Error al actualizar la orden:', err);
      setUpdateError('Error al actualizar la orden.');
      toast.error('Error al actualizar la orden.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Cargando detalles de la orden...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p className="text-gray-600">Orden no encontrada.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-500 hover:underline mb-4"
      >
        <FaArrowLeft className="mr-1" /> Volver
      </button>

      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <FaShippingFast className="mr-2 text-blue-500" />
        Detalles de la Orden {order.uniqueID}
      </h2>

      <div className="mb-4">
        <h4 className="font-semibold">Fecha:</h4>
        <p>{new Date(order.dateCreated).toLocaleString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Nombre:</h4>
        <p>{order.shippingAddress.firstName}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Apellidos:</h4>
        <p>{order.shippingAddress.lastName}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Número de Teléfono:</h4>
        <p>{order.shippingAddress.phone}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Método de Pago:</h4>
        <p>{order.paymentMethod}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">ID Usuario:</h4>
        <p>{order.shippingAddress.ownerId}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Dirección de Envío:</h4>
        <p>
          {order.shippingAddress.address}, {order.shippingAddress.colonia}, {order.shippingAddress.city}, {order.shippingAddress.state}, C.P. {order.shippingAddress.zipcode}, {order.shippingAddress.country}
        </p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Estado de la Orden:</h4>
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            order.orderStatus === 'pendiente'
              ? 'bg-yellow-100 text-yellow-800'
              : order.orderStatus === 'enviado'
                ? 'bg-blue-100 text-blue-800'
                : order.orderStatus === 'entregado'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
          }`}
        >
          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </span>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Número de Guía:</h4>
        <p>{order.trackingNumber ? order.trackingNumber : 'N/A'}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Paquetería:</h4>
        <p>{order.courier ? order.courier : 'N/A'}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Artículos Comprados:</h4>
        <ul className="list-disc list-inside">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} | Cantidad: {item.qty} | Precio unitario: ${item.price.toFixed(2)} | Total: ${item.total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Botón para abrir el modal de envío */}
      {order && (
        <button
          onClick={openUpdateModal}
          className="flex items-center  px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          <FaEdit className="mr-2" /> Enviar Orden
        </button>
      )}

      {/* Modal para Actualizar el Estado de Envío */}
      {isUpdateModalOpen && (
        <Modal onClose={closeUpdateModal}>
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
                  onClick={closeUpdateModal}
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
      )}
    </div>
  );
}
