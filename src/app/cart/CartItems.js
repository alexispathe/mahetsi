// src/components/CartItems.js

import React from 'react';
import Link from 'next/link';

export default function CartItems({ items, handleRemoveItem }) {
  if (items.length === 0) {
    return <p className="text-gray-700 mb-6">Tu carrito está vacío</p>;
  }

  return (
    <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
      <div className="">
        {items.map((item, index) => (
          <div key={`${item.uniqueID}-${item.size}`} className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-md mr-4"></div>
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Size: {item.size || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
              <p className="text-sm text-gray-500">{item.qty} @ ${item.price.toFixed(2)}</p>
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={() => handleRemoveItem(item.uniqueID, item.size)}
                aria-label={`Eliminar ${item.name}`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
