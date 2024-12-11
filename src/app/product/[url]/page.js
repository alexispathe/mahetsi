// src/app/product/[url]/page.js
'use client';

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";

export default function ProductDetail() {
  const params = useParams();
  const productUrl = params.url;

  // Estado para el producto
  const [product, setProduct] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [typeName, setTypeName] = useState('');

  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la imagen principal y modal
  const [mainImage, setMainImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const thumbnails = product ? product.images : [];

  // Estado para manejo de favoritos
  const [isLiked, setIsLiked] = useState(false);

  // Estado para el tamaño seleccionado
  const [selectedSize, setSelectedSize] = useState("Medium");

  // Manejar la obtención de datos del producto desde la API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/public/get/byUrl/${productUrl}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado.');
          } else {
            throw new Error('Error al obtener el producto.');
          }
        }

        const data = await response.json();
        setProduct(data.product);
        setBrandName(data.brandName);
        setTypeName(data.typeName);
        setMainImage(data.product.images[0]);

        // Verificar si el producto está en favoritos
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsLiked(favorites.includes(data.product.uniqueID));

      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productUrl) {
      fetchProduct();
    }
  }, [productUrl]);

  // Manejar la selección de una miniatura
  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  // Manejar el clic en la imagen principal para abrir el modal
  const handleImageClick = () => {
    setShowModal(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Manejar clic fuera del modal para cerrarlo
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

  // Manejar agregar al carrito
  const handleAddToCart = () => {
    if (!product) return; // Asegurarse de que el producto existe
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.uniqueID === product.uniqueID);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].qty += 1;
    } else {
      cart.push({
        uniqueID: product.uniqueID,
        name: product.name,
        price: product.price,
        image: product.images[0], 
        size: selectedSize,  // Usar el tamaño seleccionado
        qty: 1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Producto agregado al carrito");
  };

  // Manejar favoritos
  const handleToggleFavorite = () => {
    if (!product) return; // Asegurarse de que el producto existe
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(product.uniqueID)) {
      // Si ya está, lo removemos
      const updated = favorites.filter(id => id !== product.uniqueID);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsLiked(false);
    } else {
      // Si no está, lo agregamos
      favorites.push(product.uniqueID);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsLiked(true);
    }
  };

  // Manejar cambio de tamaño
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  if (loading) {
    return (
      <>
        <Header position="relative" textColor="text-black"/>
        <div className="flex justify-center items-center my-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
            {/* Skeleton de Imágenes */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Thumbnails Skeleton */}
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto max-h-96 lg:max-h-full gap-2">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} className="w-20 h-20 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
              </div>

              {/* Imagen Principal Skeleton */}
              <div className="flex-1 relative flex justify-center items-center">
                <div className="w-auto h-full max-h-96 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>

            {/* Skeleton de Información */}
            <div className="space-y-6">
              <div className="w-1/2 h-6 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-1/3 h-4 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-1/2 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header position="relative" textColor="text-black"/>
        <div className="flex justify-center items-center my-10 px-4">
          <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header position="relative" textColor="text-black"/>
        <div className="flex justify-center items-center my-10 px-4">
          <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Header position="relative" textColor="text-black"/>
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
            <p className="text-gray-500 text-sm">HOME / {brandName.toUpperCase()} / {typeName.toUpperCase()}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <div className="text-yellow-500 text-lg">⭐⭐⭐⭐☆</div>
              <p className="text-sm text-gray-600">({product.numReviews} Reviews)</p>
            </div>
            <div className="flex items-baseline space-x-4">
              <p className="text-2xl text-red-600 font-semibold">${product.price.toFixed(2)}</p>
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
                  value={selectedSize}
                  onChange={handleSizeChange} // Vinculamos el estado al select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
              <button 
                className={`px-4 py-2 rounded-md hover:bg-red-500 transition-colors duration-300 
                  ${isLiked ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'}`}
                onClick={handleToggleFavorite}
              >
                {isLiked ? '❤' : '♡'}
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
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold z-10"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              aria-label="Cerrar modal"
            >
              ✖
            </button>
            <img
              src={mainImage}
              alt="Producto principal expandido"
              className="max-w-full max-h-screen rounded-md object-contain cursor-pointer"
              onClick={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}
