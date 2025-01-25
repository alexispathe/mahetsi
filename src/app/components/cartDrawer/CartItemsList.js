'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';

/**
 * Lista de productos en el carrito.
 * 
 */
export default function CartItemsList({
  items,
  isRemoving,
  isUpdating,
  handleRemove,
  handleRemoveQuantity,
  handleAddQuantity,
}) {
  if (!items || items.length === 0) {
    return <p className="text-gray-700">Tu carrito está vacío</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.uniqueID} className="flex justify-between items-center">
          <div className="flex items-center">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={96}
                height={96}
                className="object-cover rounded-md mr-4"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-md mr-4"></div>
            )}
            <div>
              <Link href={`/product/${item.url}`}>
                <p className="font-semibold text-gray-800 hover:underline">
                  {item.name}
                </p>
              </Link>
              <p className="text-sm text-gray-600">
                Cantidad:
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
                <span className="text-sm text-gray-500 mx-2">{item.qty}</span>
                <button
                  onClick={() => handleAddQuantity(item)}
                  className={`px-2 py-1 text-sm bg-transparent text-gray-700 hover:text-black transition-colors duration-200 ${
                    isUpdating === item.uniqueID
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                  disabled={isUpdating === item.uniqueID}
                  aria-label={`Aumentar cantidad de ${item.name}`}
                >
                  +
                </button>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-lg text-gray-800">
              ${(item.price * item.qty).toFixed(2)}
            </span>
            <button
              onClick={() => handleRemove(item.uniqueID)}
              className="text-red-500 hover:text-red-700 mt-2 text-sm flex items-center"
              disabled={isRemoving === item.uniqueID}
              aria-label={`Eliminar ${item.name}`}
            >
              {isRemoving === item.uniqueID
                ? 'Eliminando...'
                : (
                  <>
                    <FaTrash className="mr-1" title="Eliminar"/> 
                  </>
                )
              }
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
