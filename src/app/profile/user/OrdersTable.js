// src/app/profile/user/OrdersTable.js
'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { FaShippingFast } from 'react-icons/fa';
import ReviewModal from './ReviewModal';

export default function OrdersTable({ orders, userReviews, onReviewSubmitted }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Para las reseñas
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const openReviewModal = (product) => {
    setReviewProduct(product);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setReviewProduct(null);
    setShowReviewModal(false);
  };

  // Función para verificar si ya se ha reseñado un producto en una orden
  const hasReviewed = (orderId, productId) => {
    return userReviews.some(
      (review) => review.orderId === orderId && review.productId === productId
    );
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
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado de envio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Guía
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paquetería
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order.uniqueID}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {order.uniqueID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(order.dateCreated).toLocaleDateString('es-MX', {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                    })}

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${order.grandTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.payment.status}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.trackingNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.courier || 'N/A'}
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
          <div className="pb-7 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaShippingFast className="mr-2 text-blue-500" />
              Detalles de la Orden {selectedOrder.uniqueID}
            </h2>

            {/* Fecha */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg text-gray-700">Fecha:</h4>
              <p className="text-gray-600">
                {new Date(selectedOrder.dateCreated).toLocaleString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>

            {/* Método de Pago */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg text-gray-700">Método de Pago:</h4>
              <p className="text-gray-600">{selectedOrder.paymentMethod}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-lg text-gray-700">Estado de pago:</h4>
              <p className="text-gray-600">{selectedOrder.payment.status}</p>
            </div>

            {/* Dirección de Envío */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg text-gray-700">Dirección de Envío:</h4>
              <p className="text-gray-600">
                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.colonia},{' '}
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, C.P.{' '}
                {selectedOrder.shippingAddress.zipcode},{' '}
                {selectedOrder.shippingAddress.betweenStreets},{' '}
                {selectedOrder.shippingAddress.reference},{' '}
                {selectedOrder.shippingAddress.country}
              </p>
            </div>

            {/* Estado de la Orden */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg text-gray-700">Estado de envio:</h4>
              <span
                className={`px-4 py-2 inline-flex text-xs font-semibold rounded-full ${selectedOrder.orderStatus === 'pendiente'
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

            {/* Artículos Comprados */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg text-gray-700">Artículos Comprados:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {selectedOrder.items.map((item, index) => {
                  const alreadyReviewed = hasReviewed(selectedOrder.uniqueID, item.uniqueID);
                  return (
                    <li key={index} className="my-2">
                      <strong>{item.name}</strong> | Cantidad: {item.qty} | Precio unitario: $
                      {item.price.toFixed(2)} | Total: ${item.total.toFixed(2)}
                      {/* Botón para reseña solo si la orden está entregada y no ha sido reseñada */}
                      {selectedOrder.orderStatus === 'entregado' && !alreadyReviewed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Para que no cierre el modal principal
                            openReviewModal(item);
                          }}
                          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                        >
                          Dejar Reseña
                        </button>
                      )}
                      {selectedOrder.orderStatus === 'entregado' && alreadyReviewed && (
                        <span className="ml-4 text-green-600 text-sm">Reseña ya realizada</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Número de Guía */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg text-gray-700">Número de Guía:</h4>
              <p className="text-gray-600">{selectedOrder.trackingNumber || 'N/A'}</p>
            </div>

            {/* Paquetería */}
            <div className="mb-4">
              <h4 className="font-semibold text-lg text-gray-700">Paquetería:</h4>
              <p className="text-gray-600">{selectedOrder.courier || 'N/A'}</p>
            </div>

            {/* Botón de Cerrar */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para dejar reseña de un producto específico */}
      {showReviewModal && reviewProduct && (
        <ReviewModal
          product={reviewProduct}
          orderId={selectedOrder?.uniqueID}
          onClose={closeReviewModal}
          onReviewSubmitted={onReviewSubmitted} // Pasa la función para actualizar reseñas
        />
      )}
    </>
  );
}
