'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaShippingFast, FaEdit, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from '../../../user/Modal';
import { AuthContext } from '@/context/AuthContext'; // Importa el contexto de autenticación

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { currentUser } = useContext(AuthContext); // Obtener el usuario actual
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Verifica si el usuario es admin, de lo contrario redirige al inicio
    if (currentUser && !currentUser.permissions?.includes('admin')) {
      router.push('/');
      return;
    }

    fetchOrderDetails();
  }, [orderId, currentUser, router]);

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
        router.push('/');

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

      {/* Tabla de Información Principal */}
      <div className="mb-6 overflow-x-auto">
        <table className="min-w-full bg-white border">
          <tbody>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Fecha</th>
              <td className="px-6 py-4 text-sm text-gray-700">
                {new Date(order.dateCreated).toLocaleString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </td>
            </tr>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nombre</th>
              <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.firstName}</td>
            </tr>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Apellido</th>
              <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.lastName}</td>
            </tr>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Número de Teléfono</th>
              <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.phone}</td>
            </tr>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Método de Pago</th>
              <td className="px-6 py-4 text-sm text-gray-700">{order.paymentMethod}</td>
            </tr>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">ID Usuario</th>
              <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.ownerId}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Artículos Comprados */}
      <div className="mb-6 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-2">Artículos Comprados</h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dirección de Envío */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Dirección de Envío</h3>
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="min-w-full">
            <tbody>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Calle</th>
                <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.address}</td>
              </tr>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Colonia</th>
                <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.colonia}</td>
              </tr>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ciudad</th>
                <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.city}</td>
              </tr>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
                <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.state}</td>
              </tr>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">C.P.</th>
                <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.zipcode}</td>
              </tr>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Entre calles</th>
                <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.betweenStreets}</td>
              </tr>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Referencias</th>
                <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.references}</td>
              </tr>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">País</th>
                <td className="px-6 py-4 text-sm text-gray-700">{order.shippingAddress.country}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Estado de la Orden */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Estado de la Orden</h3>
        <div className="flex items-center space-x-3">
          <span
            className={`px-4 py-2 inline-flex text-xs font-semibold rounded-full ${order.orderStatus === 'pendiente'
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
          <div className="flex items-center text-sm text-gray-600">
            {order.orderStatus === 'pendiente' && <FaClock className="mr-1 text-yellow-800" />}
            {order.orderStatus === 'enviado' && <FaShippingFast className="mr-1 text-blue-800" />}
            {order.orderStatus === 'entregado' && <FaCheckCircle className="mr-1 text-green-800" />}
            {order.orderStatus === 'cancelado' && <FaTimesCircle className="mr-1 text-red-800" />}
            <span>
              {order.orderStatus === 'pendiente' && 'Esperando confirmación'}
              {order.orderStatus === 'enviado' && 'En tránsito'}
              {order.orderStatus === 'entregado' && 'Entregado'}
              {order.orderStatus === 'cancelado' && 'Orden cancelada'}
            </span>
          </div>
        </div>
      </div>

      {/* Número de Guía y Paquetería */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Información de Envío</h3>
        <div className="space-y-2">
          <p>
            <strong className="font-medium text-gray-700">Número de Guía:</strong>{' '}
            <span className="text-gray-800">{order.trackingNumber ? order.trackingNumber : 'N/A'}</span>
          </p>
          <p>
            <strong className="font-medium text-gray-700">Paquetería:</strong>{' '}
            <span className="text-gray-800">{order.courier ? order.courier : 'N/A'}</span>
          </p>
        </div>
      </div>

      {/* Botón para abrir el modal de envío */}
      {order.orderStatus === 'pendiente' && (
        <div className="flex justify-end mb-6">
          <button
            onClick={openUpdateModal}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            <FaEdit className="mr-2" /> Enviar Orden
          </button>
        </div>
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
