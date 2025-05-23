// src/components/SearchModal.js
'use client';

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';


// Importa los contextos para acceder a la lógica de carrito y favoritos
import { CartContext } from "@/context/CartContext/CartContext";
import { FavoritesContext } from "@/context/FavoritesContext";

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(isOpen);
  const [animation, setAnimation] = useState("");

  const [addingCart, setAddingCart] = useState([]);
  const [togglingFavorite, setTogglingFavorite] = useState([]);

  const { addItemToCart } = useContext(CartContext);
  const { addFavorite, removeFavorite, favoriteIDs } = useContext(FavoritesContext);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimation("animate-fadeIn");
    } else if (visible) {
      setAnimation("animate-fadeOut");
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  useEffect(() => {
    let abort = false;
    const fetchData = async () => {
      if (!searchQuery.trim()) {
        setFiltered([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/public/get/search?search=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        if (!abort) {
          setFiltered(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        if (!abort) {
          setFiltered([]);
        }
      } finally {
        if (!abort) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      abort = true;
    };
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (event.target.closest(".search-modal") === null) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!visible) return null;

  const handleAddToCart = async (product) => {
    setAddingCart((prev) => [...prev, product.uniqueID]);

    const cartItem = { uniqueID: product.uniqueID, qty: 1 };

    try {
      await addItemToCart(cartItem);
      toast.success(
        <div className="flex items-center">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={50}
            height={50}
            className="mr-2 rounded"
          />
          <span>{product.name} ha sido añadido al carrito.</span>
        </div>,
        { theme: "light", icon: false }
      );
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      toast.error(`Error al agregar al carrito: ${err.message}`);
    } finally {
      setAddingCart((prev) =>
        prev.filter((id) => id !== product.uniqueID)
      );
    }
  };

  const handleToggleFavorite = async (product) => {
    setTogglingFavorite((prev) => [...prev, product.uniqueID]);

    try {
      if (favoriteIDs.includes(product.uniqueID)) {
        await removeFavorite(product.uniqueID);
        toast.error(
          <div className="flex items-center">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={50}
              height={50}
              className="mr-2 rounded"
            />
            <span>{product.name} ha sido eliminado de tus favoritos.</span>
          </div>,
          { theme: "light", icon: false }
        );
      } else {
        await addFavorite(product.uniqueID);
        toast.success(
          <div className="flex items-center">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={50}
              height={50}
              className="mr-2 rounded"
            />
            <span>{product.name} ha sido añadido a tus favoritos.</span>
          </div>,
          { theme: "light", icon: false }
        );
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error(`Error toggling favorite: ${err.message}`);
    } finally {
      setTogglingFavorite((prev) =>
        prev.filter((id) => id !== product.uniqueID)
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${animation}`}
    >
      <div className="search-modal bg-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative flex flex-col max-h-screen">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg text-gray-600 hover:text-gray-900"
          aria-label="Cerrar búsqueda"
        >
         <IoClose />
        </button>

        <h2 className="text-xl font-semibold mb-4">¿Qué estás buscando?</h2>

        <input
          type="text"
          placeholder="Busca por producto, categoría, subcategoría o descripción..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Campo de búsqueda"
        />

        {searchQuery && (
          <div className="text-sm mb-4">
            <span>
              {filtered.length} resultado(s) para {searchQuery}
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4">
          {loading ? (
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filtered.map((product) => (
              <div key={product.uniqueID} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-md transition-colors">
                <Link href={`/product/${product.url}`} className="flex items-center space-x-4">
                  <Image src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" width={64} height={64} />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price?.toFixed(2)}</p>
                  </div>
                </Link>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleFavorite(product)}
                    className={`hover:text-green-800 ${favoriteIDs.includes(product.uniqueID) ? 'text-red-500' : 'text-green-600'
                      }`}
                  >
                    {favoriteIDs.includes(product.uniqueID) ? <FaHeart /> : <FaRegHeart />}
                  </button>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaShoppingCart />
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
