'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';

export default function ToastNotification({ 
  show,         // boolean: si debe mostrarse la notificación
  onClose,      // callback: para cerrarla manualmente (clic en la "X")
  productName,
  productPrice,
  productImage
}) {
  const [visible, setVisible] = useState(show);

  // Actualiza la visibilidad cuando cambia la prop "show"
  useEffect(() => {
    setVisible(show);
  }, [show]);

  // Cierra automáticamente a los 5 segundos
  useEffect(() => {
    let timer;
    if (visible) {
      timer = setTimeout(() => {
        handleClose();
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible]);

  // Cierre manual
  const handleClose = () => {
    setVisible(false);
    onClose && onClose(); 
  };

  return (
    <>
      {visible && (
        <div
          className={`
            fixed top-5 right-5 z-50
            bg-white shadow-md rounded-md border border-gray-200 
            overflow-hidden w-80 animate-fadeInSlideIn 
            flex items-center
          `}
        >
          {/* Contenedor del contenido (izquierda) */}
          <div className="flex flex-col w-full p-4">
            <div className="flex justify-between items-start">
              {/* Info del producto */}
              <div className="mr-4">
                <h2 className="font-semibold text-lg text-gray-800">{productName}</h2>
                <p className="text-sm text-gray-500">${productPrice?.toFixed(2)}</p>
                <div className="flex items-center space-x-2 text-green-600 mt-2">
                  <FaShoppingCart />
                  <span className="font-medium">Agregado al carrito</span>
                </div>
              </div>
              {/* Botón de cierre */}
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={handleClose}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Imagen (derecha) */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={productImage}
              alt="Producto"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
