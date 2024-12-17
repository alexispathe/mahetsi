// src/cart/CartItems.js

'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Importar la etiqueta Image

export default function CartItems({ items, handleRemoveItem }) {
  if (items.length === 0) {
    return <p className="text-gray-700">Tu carrito está vacío</p>;
  }

  return (
    <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
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
            <div className="flex items-center space-x-4">
              <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
              <p className="text-sm text-gray-500">{item.qty} @ ${item.price.toFixed(2)}</p>
              <button
                onClick={() => handleRemoveItem(item.uniqueID, item.size)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
