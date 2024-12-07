'use client';
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import { products, brands, types } from "../../category/data";

export default function ProductDetail() {
  const params = useParams();
  const product = products.find((p) => p.url === params.url);

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
  const thumbnails = product.images;

  const [isLiked, setIsLiked] = useState(false);

  // Al montar, revisar si el producto está en favoritos
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsLiked(favorites.includes(product.uniqueID));
  }, [product.uniqueID]);

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

  const handleAddToCart = () => {
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
        size: "Medium",  // Este valor puede actualizarse más tarde
        qty: 1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Producto agregado al carrito");
  };

  const handleToggleFavorite = () => {
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

  // Estado para manejar el tamaño seleccionado
  const [selectedSize, setSelectedSize] = useState("Medium");

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
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
