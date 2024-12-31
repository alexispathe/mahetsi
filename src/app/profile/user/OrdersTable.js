// src/app/profile/user/OrdersTable.js
'use client';

import React, { useState } from 'react';
import Modal from './Modal';

export default function OrdersTable({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {orders.length === 0 ? (
        <p className="text-gray-600">No has realizado ninguna compra aún.</p>
      ) : (
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
                  Método de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr
                  key={order.uniqueID}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {order.uniqueID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(order.dateCreated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${order.grandTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.orderStatus === 'pendiente'
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalles de la Orden */}
      {isModalOpen && selectedOrder && (
        <Modal onClose={closeModal}>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Detalles de la Orden {selectedOrder.uniqueID}</h3>
            <div className="mb-4">
              <h4 className="font-semibold">Fecha:</h4>
              <p>{new Date(selectedOrder.dateCreated).toLocaleString('es-MX', {
                weekday: 'long', // Día de la semana completo (Ej. "lunes")
                year: 'numeric', // Año en formato completo (Ej. "2024")
                month: 'long', // Nombre del mes completo (Ej. "diciembre")
                day: 'numeric', // Día del mes (Ej. "31")
                hour: '2-digit', // Hora en formato de dos dígitos (Ej. "20")
                minute: '2-digit', // Minuto en formato de dos dígitos (Ej. "21")
                second: '2-digit', // Segundo en formato de dos dígitos (Ej. "28")
                hour12: true // Para usar el formato de 12 horas (AM/PM)
              })}
              </p>

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
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedOrder.orderStatus === 'pendiente'
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
    </>
  );
}
