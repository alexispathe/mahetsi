'use client';
import React, { useState } from "react";
import Header from '../components/Header';

export default function ProductDetail() {
  const [mainImage, setMainImage] = useState(
    "https://mahetsipage.web.app/assets/images/products/img-5.jpeg"
  );

  const thumbnails = [
    "https://mahetsipage.web.app/assets/images/products/img-1.jpeg",
    "https://mahetsipage.web.app/assets/images/products/img-2.jpeg",
    "https://mahetsipage.web.app/assets/images/products/img-3.jpeg",
    "https://mahetsipage.web.app/assets/images/products/img-4.jpeg",
  ];

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center my-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          
          {/* Sección de Imágenes del Producto */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto max-h-96 lg:max-h-full gap-2">
              {thumbnails.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 rounded-md border-2 ${
                    mainImage === image ? 'border-gray-800' : 'border-transparent'
                  } cursor-pointer object-cover transition border-2`}
                  onClick={() => handleThumbnailClick(image)}
                />
              ))}
            </div>
            {/* Imagen Principal */}
            <div className="flex-1">
              <img
                src={mainImage}
                alt="Producto principal"
                className="w-full h-full rounded-md object-cover"
              />
            </div>
          </div>

          {/* Sección de Información del Producto */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <p className="text-gray-500 text-sm">HOME / ACTIVITIES / NATURAL PRODUCTS</p>
            
            {/* Título del Producto */}
            <h1 className="text-3xl font-bold">Aloe Vera Handmade Soap</h1>
            
            {/* Reseñas */}
            <div className="flex items-center space-x-2">
              <div className="text-yellow-500 text-lg">⭐⭐⭐⭐☆</div>
              <p className="text-sm text-gray-600">(1288 Reviews)</p>
            </div>
            
            {/* Precio */}
            <div className="flex items-baseline space-x-4">
              <p className="text-2xl text-red-600 font-semibold">$15.99</p>
              <p className="line-through text-gray-500">$20.00</p>
              <p className="text-green-600">Save $4.01</p>
            </div>
            
            {/* Opciones del Producto */}
            <div>
              {/* Color */}
              <div className="mb-4">
                <p className="text-sm font-medium">COLOUR: GREEN</p>
                <div className="flex space-x-2 mt-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 border border-gray-300 cursor-pointer"></div>
                  <div className="w-5 h-5 rounded-full bg-blue-500 border border-gray-300 cursor-pointer"></div>
                  <div className="w-5 h-5 rounded-full bg-red-500 border border-gray-300 cursor-pointer"></div>
                </div>
              </div>
              
              {/* Tamaño */}
              <div>
                <label htmlFor="size-select" className="block text-sm font-medium">
                  SIZE:
                </label>
                <select
                  id="size-select"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option>Please Select Size</option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
            
            {/* Botones de Acción */}
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                Add To Cart
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500">
                ❤
              </button>
            </div>
            
            {/* Información de Entrega */}
            <div className="text-sm text-gray-600">
              📦 Free delivery over $99. Next day delivery $9.99
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
