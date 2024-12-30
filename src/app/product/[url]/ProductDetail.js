'use client';

import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import Image from 'next/image'; 
import { AuthContext } from "@/context/AuthContext"; 
import { CartContext } from "@/context/CartContext"; 
import { FavoritesContext } from "@/context/FavoritesContext";
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaTimes, FaBox } from 'react-icons/fa';
import ToastNotification from './ToastNotification'; // la ruta puede variar
export default function ProductDetail({ productUrl }) {
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);


  // Para la animación de thumbnails
  const [clickedImage, setClickedImage] = useState(null);

  // Para la animación de apertura/cierre del modal
  const [visible, setVisible] = useState(showModal);
  const [animation, setAnimation] = useState('');
  const isFadingOut = animation === 'animate-fadeOutZoom';

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

  // Manejo de thumbnails
  const handleThumbnailClick = (image) => {
    setClickedImage(image);
    setMainImage(image);
  };

  // Modal de imagen
  const handleImageClick = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
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

  // Animación del modal
  useEffect(() => {
    if (showModal) {
      setVisible(true);
      setAnimation('animate-fadeInZoom');
    } else if (visible) {
      setAnimation('animate-fadeOutZoom');
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showModal, visible]);

  // Animación de "selección" en la thumbnail
  useEffect(() => {
    if (clickedImage) {
      const timer = setTimeout(() => {
        setClickedImage(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [clickedImage]);

  // Manejo del carrito
  const handleAddToCartClick = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    const cartItem = {
      uniqueID: product.uniqueID,
      qty: 1
    };

    await addItemToCart(cartItem);
    setIsAddingToCart(false);
        // Mostramos la notificación
        setShowToast(true);
  };

  // Callback para cerrar la notificación manualmente
  const handleCloseToast = () => {
    setShowToast(false);
  };
  // Manejo de favoritos
  const handleToggleFavorite = async () => {
    if (!product) return;
    setIsTogglingFavorite(true);

    try {
      if (favoriteIDs.includes(product.uniqueID)) {
        await removeFavorite(product.uniqueID);
      } else {
        await addFavorite(product.uniqueID);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert(`Error al togglear favorito: ${err.message}`);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // ¿Es favorito?
  const isLiked = useMemo(() => {
    if (!product) return false;
    return favoriteIDs.includes(product.uniqueID);
  }, [favoriteIDs, product]);

  // Render de estados de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center my-10 px-4">
        <div className="animate-pulse space-y-6 w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="w-full h-96 bg-gray-300 rounded-md"></div>
              <div className="flex space-x-2 mt-4">
                <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-3/4 h-8 bg-gray-300 rounded-md"></div>
              <div className="w-full h-6 bg-gray-300 rounded-md"></div>
              <div className="w-1/2 h-6 bg-gray-300 rounded-md"></div>
              <div className="w-full h-10 bg-gray-300 rounded-md"></div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-300 rounded-md"></div>
                <div className="w-full h-4 bg-gray-300 rounded-md"></div>
                <div className="w-5/6 h-4 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center my-10 px-4">
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center my-10 px-4">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
      </div>
    );
  }

  // Render principal
  return (
    <div className="flex justify-center items-center my-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Sección de Imágenes */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto max-h-96 lg:max-h-full gap-2">
            {thumbnails.map((image, index) => (
              <div
                key={index}
                className={`w-20 h-20 rounded-md border-2 ${
                  mainImage === image ? 'border-gray-800' : 'border-transparent'
                } ${clickedImage === image ? 'animate-zoomSelected' : ''}`}
              >
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
          <div
            className="flex-1 relative flex justify-center items-center"
            onClick={handleImageClick}
          >
            <Image
              src={mainImage}
              alt="Producto principal"
              width={500}
              height={500}
              className={`w-auto h-full max-h-96 rounded-md object-contain cursor-pointer transition-transform transform hover:scale-105 ${
                clickedImage === mainImage ? 'animate-zoomSelected' : ''
              }`}
            />
          </div>
        </div>

        {/* Sección de Información */}
        <div className="space-y-6">
          <p className="text-gray-500 text-sm">
            HOME / {brandName.toUpperCase()} / {typeName.toUpperCase()}
          </p>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-500 text-lg">
              {[1, 2, 3, 4, 5].map((star) =>
                star <= product.rating ? (
                  <FaStar key={star} />
                ) : (
                  <FaRegStar key={star} />
                )
              )}
            </div>
            <p className="text-sm text-gray-600">
              ({product.numReviews} Reviews)
            </p>
          </div>

          {/* Descripción */}
          <div className="prose prose-sm text-gray-700">
            <h2 className="text-xl font-semibold mt-4">Descripción</h2>
            <p>{product.description}</p>
          </div>

          {/* Precio */}
          <div className="flex items-baseline space-x-4">
            <p className="text-2xl text-red-600 font-semibold">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Categoría */}
          <div>
            <div className="mb-4">
              <p className="text-sm font-medium">
                CATEGORÍA: {typeName}
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 ${
                isAddingToCart ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={handleAddToCartClick}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Agregando...' : 'Agregar al carrito'}
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center px-4 py-2 rounded-md hover:bg-red-500 transition-colors duration-300 ${
                isTogglingFavorite ? 'cursor-not-allowed opacity-50' : ''
              } ${isLiked ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'}`}
              disabled={isTogglingFavorite}
            >
              {isTogglingFavorite ? (
                'Procesando...'
              ) : (
                <>
                  {isLiked ? (
                    <FaHeart className="mr-2" />
                  ) : (
                    <FaRegHeart className="mr-2" />
                  )}
                  Favorito
                </>
              )}
            </button>
          </div>

          {/* Info de envío */}
          <div className="text-sm text-gray-600 flex items-center">
            <FaBox className="mr-1" />
            Envío gratis en pedidos superiores a $99. Envío al día siguiente por $9.99
          </div>
        </div>
      </div>

      {/* Modal de Imagen Expandida */}
      {visible && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${animation} ${
            isFadingOut ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
          onClick={closeModal}
        >
          <div className="relative flex justify-center" ref={modalRef}>
            <Image
              src={mainImage}
              alt="Producto principal expandido"
              width={1000}
              height={1000}
              className="max-w-full max-h-screen rounded-md object-contain cursor-pointer"
              onClick={() => setShowModal(false)}
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-pink-500 transition-colors duration-300"
              aria-label="Cerrar zoom"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
       <ToastNotification
        show={showToast}
        onClose={handleCloseToast}
        productName={product?.name}
        productPrice={product?.price}
        productImage={product?.images[0]} 
      />
    </div>
  );
}