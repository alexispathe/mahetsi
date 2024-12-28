// src/cart/CartItems.js

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Importar la etiqueta Image

export default function CartItems({ items, handleRemoveItem, handleAddQuantity, handleRemoveQuantity }) {
  const [isRemoving, setIsRemoving] = useState(null); // Estado para controlar la eliminación del producto
  const [isUpdating, setIsUpdating] = useState(null); // Estado para controlar la actualización de cantidad

  if (items.length === 0) {
    return <p className="text-gray-700">Tu carrito está vacío</p>;
  }

  return (
    <section className="py-8 px-6 bg-white shadow-lg rounded-xl mb-8 text-[#1c1f28]">
      <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.uniqueID} className="flex justify-between items-center mb-4">
            {/* Información del Producto */}
            <div className="flex items-center">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96} // Ancho de la imagen
                  height={96} // Alto de la imagen
                  className="object-cover rounded-md mr-4"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-md mr-4"></div>
              )}
              <div>
                <Link href={`/product/${item.url}`}>
                  <p className="font-semibold">{item.name}</p>
                </Link>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
              </div>
            </div>
            {/* Controles de Cantidad y Eliminar */}
            <div className="flex items-center space-x-4">
              {/* Precio */}
              <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
              {/* Controles de Cantidad */}
              <div className="flex items-center space-x-2">
                {/* Botón para disminuir cantidad */}
                <button
                  onClick={() => handleRemoveQuantity(item)}
                  className={`px-2 py-1 text-sm bg-transparent text-gray-700 hover:text-black transition-colors duration-200 ${
                    item.qty === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  disabled={item.qty === 1 || isUpdating === item.uniqueID}
                  aria-label={`Disminuir cantidad de ${item.name}`}
                >
                  -
                </button>
                {/* Cantidad */}
                <p className="text-sm text-gray-500">{item.qty}</p>
                {/* Botón para aumentar cantidad */}
                <button
                  onClick={() => handleAddQuantity(item)}
                  className={`px-2 py-1 text-sm bg-transparent text-gray-700 hover:text-black transition-colors duration-200 ${
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
                className="text-red-500 hover:text-red-700 text-sm"
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
