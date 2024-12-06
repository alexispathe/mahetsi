'use client';
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation"; // Si usas Next.js 13 con el App Router
import Header from "../../components/Header";
import { products, brands, types } from "../../category/data";

export default function ProductDetail() {
  const params = useParams();
  const product = products.find((p) => p.url === params.url);

  // Si el producto no existe, puedes manejar el caso:
  if (!product) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center my-10 px-4">
          <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        </div>
      </>
    );
  }

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const thumbnails = product.images; // Usa las imágenes del producto

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  const brandName = brands.find((b) => b.uniqueID === product.brandID)?.name || "";
  const typeName = types.find((t) => t.uniqueID === product.typeID)?.name || "";

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
                  } cursor-pointer object-cover transition`}
                  onClick={() => handleThumbnailClick(image)}
                />
              ))}
            </div>

            {/* Imagen Principal */}
            <div
              className="flex-1 relative flex justify-center items-center"
              onClick={handleImageClick}
            >
              <img
                src={mainImage}
                alt="Producto principal"
                className="w-auto h-full max-h-96 rounded-md object-contain cursor-pointer transition-transform transform hover:scale-105"
              />
            </div>
          </div>

          {/* Sección de Información del Producto */}
          <div className="space-y-6">
            {/* Puedes ajustar el breadcrumb según tu lógica */}
            <p className="text-gray-500 text-sm">HOME / {brandName.toUpperCase()} / {typeName.toUpperCase()}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <div className="text-yellow-500 text-lg">⭐⭐⭐⭐☆</div>
              <p className="text-sm text-gray-600">({product.numReviews} Reviews)</p>
            </div>
            <div className="flex items-baseline space-x-4">
              <p className="text-2xl text-red-600 font-semibold">${product.price.toFixed(2)}</p>
              {/* Aquí podrías manejar descuentos o no */}
              {/* <p className="line-through text-gray-500">$20.00</p>
              <p className="text-green-600">Save $4.01</p> */}
            </div>
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium">CATEGORÍA: {typeName}</p>
              </div>
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
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                Add To Cart
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500">
                ❤
              </button>
            </div>
            <div className="text-sm text-gray-600">
              📦 Free delivery over $99. Next day delivery $9.99
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Imagen Expandida */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="relative"
            ref={modalRef}
          >
            {/* Botón "X" para cerrar el modal */}
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold z-10"
              onClick={(e) => {
                e.stopPropagation(); // Prevenir que el clic se propague al contenedor
                closeModal();
              }}
              aria-label="Cerrar modal"
            >
              ✖
            </button>
            {/* Imagen en el modal */}
            <img
              src={mainImage}
              alt="Producto principal expandido"
              className="max-w-full max-h-screen rounded-md object-contain cursor-pointer"
              onClick={closeModal} // Cerrar el modal al hacer clic en la imagen
            />
          </div>
        </div>
      )}
    </>
  );
}
