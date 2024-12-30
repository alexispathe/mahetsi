// src/cart/CartItems.js

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Importar la etiqueta Image

export default function CartItems({ items, handleRemoveItem, handleAddQuantity, handleRemoveQuantity }) {
  const [isRemoving, setIsRemoving] = useState(null); // Estado para controlar la eliminación del producto
  const [isUpdating, setIsUpdating] = useState(null); // Estado para controlar la actualización de cantidad

  if (items.length === 0) {
    return <p className="text-gray-700 text-center">Tu carrito está vacío</p>;
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Tu carrito</h2>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.uniqueID} className="flex flex-col sm:flex-row justify-between items-center  p-4 rounded-md shadow-sm">
            {/* Información del Producto */}
            <div className="flex items-center w-full sm:w-2/3">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96} // Ancho de la imagen
                  height={96} // Alto de la imagen
                  className="object-cover rounded-md mr-4 w-24 h-24"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-md mr-4"></div>
              )}
              <div>
                <Link href={`/product/${item.url}`} className="font-semibold text-lg hover:underline">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">Precio unitario: ${item.price.toFixed(2)}</p>
              </div>
            </div>
            {/* Controles y Precio */}
            <div className="flex flex-col sm:flex-row items-center w-full sm:w-1/3 mt-4 sm:mt-0 space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Precio Total */}
              <p className="font-semibold text-xl">${(item.price * item.qty).toFixed(2)}</p>
              {/* Controles de Cantidad */}
              <div className="flex items-center space-x-2">
                {/* Botón para disminuir cantidad */}
                <button
                  onClick={() => handleRemoveQuantity(item)}
                  className={`px-3 py-1 text-lg bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200 ${
                    item.qty === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                  disabled={item.qty === 1 || isUpdating === item.uniqueID}
                  aria-label={`Disminuir cantidad de ${item.name}`}
                >
                  -
                </button>
                {/* Cantidad */}
                <span className="text-lg">{item.qty}</span>
                {/* Botón para aumentar cantidad */}
                <button
                  onClick={() => handleAddQuantity(item)}
                  className={`px-3 py-1 text-lg bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200 ${
                    isUpdating === item.uniqueID ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                  disabled={isUpdating === item.uniqueID}
                  aria-label={`Aumentar cantidad de ${item.name}`}
                >
                  +
                </button>
              </div>
              {/* Botón de Eliminar */}
              <button
                onClick={() => {
                  setIsRemoving(item.uniqueID);
                  handleRemoveItem(item.uniqueID);
                }}
                className="text-red-500 hover:text-red-700 text-sm underline"
                disabled={isRemoving === item.uniqueID}
                aria-label={`Eliminar ${item.name}`}
              >
                {isRemoving === item.uniqueID ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
