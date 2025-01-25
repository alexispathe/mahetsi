// src/app/checkout/SkeletonCartSummary.jsx

import React from 'react';

export default function SkeletonCartSummary() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28] animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>

      {/* Productos en el carrito */}
      <div className="mb-6">
        <div className="h-5 bg-gray-300 rounded w-2/4 mb-4"></div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center justify-between p-4 border rounded-md mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-300 rounded mr-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Opciones de Envío */}
      <div className="mb-6">
        <div className="h-5 bg-gray-300 rounded w-2/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((quote) => (
            <div key={quote} className="flex items-center p-4 border rounded-md">
              <div className="h-4 bg-gray-300 rounded w-4 mr-4"></div>
              <div className="flex flex-col space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen del Pedido */}
      <div className="py-6 px-4 rounded-md bg-gray-50 mb-6">
        <div className="h-5 bg-gray-300 rounded w-2/4 mb-4"></div>
        <div className="flex justify-between mb-2">
          <div className="h-3 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="h-3 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="h-3 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
        </div>
      </div>

      {/* Aceptación de Términos */}
      <div className="mt-6 flex items-center space-x-2">
        <div className="h-4 bg-gray-300 rounded w-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>

      {/* Botón de Pago */}
      <div className="mt-4 h-10 bg-gray-300 rounded w-full"></div>
    </section>
  );
}
