'use client';

import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import { AuthContext } from "@/context/AuthContext"; // Contexto de autenticación
import { CartContext } from "@/context/CartContext"; // Contexto del carrito
import { FavoritesContext } from "@/context/FavoritesContext"; // Contexto de favoritos
import Image from 'next/image'; // Importamos la etiqueta Image

export default function ProductDetail() {
  const params = useParams();
  const productUrl = params.url;

  const { currentUser } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext); 
  const { addFavorite, removeFavorite, favoriteIDs } = useContext(FavoritesContext); 

  const [product, setProduct] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [typeName, setTypeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
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

  const handleAddToCartClick = async () => {
    if (!product) return;

    const cartItem = {
      uniqueID: product.uniqueID,
      size: selectedSize,
      qty: 1
    };

    await addItemToCart(cartItem);
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
    try {
      if (favoriteIDs.includes(product.uniqueID)) {
        // Remover favorito desde el contexto
        await removeFavorite(product.uniqueID);
      } else {
        // Agregar favorito desde el contexto
        await addFavorite(product.uniqueID);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert(`Error al toggling favorito: ${err.message}`);
    }
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  // Determinar si el producto es favorito mediante el contexto
  const isLiked = useMemo(() => {
    if (!product) return false;
    return favoriteIDs.includes(product.uniqueID);
  }, [favoriteIDs, product]);

  if (loading) {
    return (
      <>
        <Header position="relative" textColor="text-black" />
        <div className="flex justify-center items-center my-10 px-4">
          <div className="animate-pulse space-y-6 w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="w-32 h-32 bg-gray-300 rounded-md"></div>
                <div className="w-32 h-32 bg-gray-300 rounded-md"></div>
              </div>
              <div className="space-y-4">
                <div className="w-full h-8 bg-gray-300 rounded-md"></div>
                <div className="w-3/4 h-6 bg-gray-300 rounded-md"></div>
                <div className="w-1/2 h-6 bg-gray-300 rounded-md"></div>
                <div className="w-full h-10 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header position="relative" textColor="text-black" />
        <div className="flex justify-center items-center my-10 px-4">
          <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header position="relative" textColor="text-black" />
        <div className="flex justify-center items-center my-10 px-4">
          <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Header position="relative" textColor="text-black" />
      <div className="flex justify-center items-center my-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Sección de Imágenes del Producto */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto max-h-96 lg:max-h-full gap-2">
              {thumbnails.map((image, index) => (
                <div key={index} className={`w-20 h-20 rounded-md border-2 ${mainImage === image ? 'border-gray-800' : 'border-transparent'}`}>
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="cursor-pointer object-cover transition"
                    onClick={() => handleThumbnailClick(image)}
                  />
                </div>
              ))}
            </div>

            {/* Imagen Principal */}
            <div className="flex-1 relative flex justify-center items-center" onClick={handleImageClick}>
              <Image
                src={mainImage}
                alt="Producto principal"
                width={500}
                height={500}
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
                onClick={handleAddToCartClick}
              >
                Agregar al carrito
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`px-4 py-2 rounded-md hover:bg-red-500 transition-colors duration-300 
                  ${isLiked ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'}`}
              >
                {isLiked ? '❤ Favorito' : '♡ Favorito'}
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
            <Image
              src={mainImage}
              alt="Producto principal expandido"
              width={1000}
              height={1000}
              className="max-w-full max-h-screen rounded-md object-contain cursor-pointer"
              onClick={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
