// src/app/profile/admin/AdminOrders.js

'use client';

import React, { useEffect, useState, useContext } from 'react';
import { FaShippingFast, FaEdit } from 'react-icons/fa';
import Modal from './Modal';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext'; // Asegúrate de que la ruta sea correcta

export default function AdminOrders() {
  const { currentUser, authLoading } = useContext(AuthContext);
  const [adminOrders, setAdminOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [filterStatus, setFilterStatus] = useState('todos'); // Agregado para filtros
  const [page, setPage] = useState(1);
  const [ordersPerPage] = useState(10); // Ajusta según tus necesidades

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
        setPage(1); // Reiniciar la página al cambiar el filtro
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

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
    setTrackingNumber('');
    setCourier('');
    setUpdateError(null);
  };

  const closeUpdateModal = () => {
    setSelectedOrder(null);
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
          orderId: selectedOrder.id,
          trackingNumber,
          courier,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Actualizar el estado de las órdenes en el frontend
        setAdminOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, ...data.order } : order
          )
        );
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

  // Calcular órdenes actuales para la paginación
  const indexOfLastOrder = page * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = adminOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(adminOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setPage(pageNumber);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaShippingFast className="mr-2 text-blue-500" />
        Órdenes de Envío
      </h2>

      {/* Filtros */}
      <div className="mb-4 flex items-center">
        <label htmlFor="statusFilter" className="mr-2 text-sm font-medium text-gray-700">
          Filtrar por Estado:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="mt-1 block w-1/4 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button
          onClick={fetchAdminOrders}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Aplicar
        </button>
      </div>

      {loading ? (
        <p>Cargando órdenes de admin...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : adminOrders.length === 0 ? (
        <p className="text-gray-600">No hay órdenes pendientes o enviadas.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID de Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método de Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {order.uniqueID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(order.dateCreated).toLocaleDateString('es-MX', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.customerName} ({order.customerEmail})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${order.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.orderStatus === 'pendiente' && (
                        <button
                          onClick={() => openUpdateModal(order)}
                          className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          <FaEdit className="mr-1" /> Enviar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="inline-flex -space-x-px">
                <li>
                  <button
                    onClick={() => paginate(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i}>
                    <button
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-2 leading-tight border border-gray-300 ${
                        page === i + 1 ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => paginate(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Modal de Detalles de la Orden */}
      {isModalOpen && selectedOrder && (
        <Modal onClose={closeModal}>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Detalles de la Orden {selectedOrder.uniqueID}</h3>
            <div className="mb-4">
              <h4 className="font-semibold">Fecha:</h4>
              <p>{new Date(selectedOrder.dateCreated).toLocaleString('es-MX', {
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
              <h4 className="font-semibold">Método de Pago:</h4>
              <p>{selectedOrder.paymentMethod}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold">Dirección de Envío:</h4>
              <p>
                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.colonia}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, C.P. {selectedOrder.shippingAddress.zipcode}, {selectedOrder.shippingAddress.country}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold">Estado de la Orden:</h4>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedOrder.orderStatus === 'pendiente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedOrder.orderStatus === 'enviado'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedOrder.orderStatus === 'entregado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
              </span>
            </div>
            {selectedOrder.trackingNumber && selectedOrder.courier && (
              <div className="mb-4">
                <h4 className="font-semibold">Número de Guía:</h4>
                <p>{selectedOrder.trackingNumber}</p>
              </div>
            )}
            {selectedOrder.courier && (
              <div className="mb-4">
                <h4 className="font-semibold">Paquetería:</h4>
                <p>{selectedOrder.courier}</p>
              </div>
            )}
            <div className="mb-4">
              <h4 className="font-semibold">Artículos Comprados:</h4>
              <ul className="list-disc list-inside">
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.name} | Cantidad: {item.qty} | Precio unitario: ${item.price.toFixed(2)} | Total: ${item.total.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex justify-end'>
              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para Actualizar el Estado de Envío */}
      {isUpdateModalOpen && selectedOrder && (
        <Modal onClose={closeUpdateModal}>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Actualizar Envío de la Orden {selectedOrder.uniqueID}</h3>
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
