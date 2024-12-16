// src/app/product/[url]/page.js

'use client';

import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import { AuthContext } from "@/context/AuthContext"; // Contexto de autenticación
import { addToLocalCart } from "../../utils/cartLocalStorage";

export default function ProductDetail() {
  const params = useParams();
  const productUrl = params.url;

  const { currentUser } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [typeName, setTypeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Medium");

  const thumbnails = product ? product.images : [];

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

        // Si el usuario está logueado, verificar si el producto es favorito en Firestore
        if (currentUser) {
          const checkRes = await fetch(`/api/favorites/checkItem?uniqueID=${data.product.uniqueID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            setIsLiked(checkData.isFavorite);
          } else {
            console.error("Error checking if product is favorite");
          }
        } else {
          // Si no está logueado, no es favorito
          setIsLiked(false);
        }

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
  }, [productUrl, currentUser]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleImageClick = () => {
    setShowModal(true);
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

  const handleAddToCart = async () => {
    if (!product) return;

    const cartItem = {
      uniqueID: product.uniqueID,
      size: selectedSize,
      qty: 1
    };

    if (currentUser) {
      // Usuario autenticado: agregar al carrito en la base de datos
      try {
        const res = await fetch('/api/cart/addItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartItem)
        });

        if (res.ok) {
          alert("Producto agregado al carrito!");
        } else {
          const data = await res.json();
          console.error("Error al agregar al carrito:", data.error);
          if (res.status === 401) {
            alert("No has iniciado sesión. Redireccionando a login...");
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
      }
    } else {
      // Usuario no autenticado: agregar al carrito en el localStorage
      addToLocalCart(cartItem);
      alert("Producto agregado al carrito (guardado localmente).");
    }
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
    if (!currentUser) {
      alert("Por favor inicia sesión para guardar productos favoritos.");
      return;
    }

    try {
      if (isLiked) {
        // Si ya es favorito, lo removemos
        const res = await fetch('/api/favorites/removeItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uniqueID: product.uniqueID })
        });
        if (res.ok) {
          setIsLiked(false);
        } else {
          const data = await res.json();
          console.error("Error removing favorite:", data.error);
        }
      } else {
        // Si no es favorito, lo agregamos
        const res = await fetch('/api/favorites/addItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uniqueID: product.uniqueID })
        });
        if (res.ok) {
          setIsLiked(true);
        } else {
          const data = await res.json();
          console.error("Error adding favorite:", data.error);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

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
                  onChange={handleSizeChange}
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
                Agregar al carrito
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
                setShowModal(false);
              }}
              aria-label="Cerrar modal"
            >
              ✖
            </button>
            <img
              src={mainImage}
              alt="Producto principal expandido"
              className="max-w-full max-h-screen rounded-md object-contain cursor-pointer"
              onClick={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
