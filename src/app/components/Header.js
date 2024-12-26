'use client';

import { useState, useEffect, useContext } from "react";
import { FaSearch, FaHeart, FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import '../styles/header.css';
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import FavoritesModal from "./FavoritesModal"; // Importar el nuevo modal
import Link from 'next/link'; // Importar Link de next/link
import { AuthContext } from "@/context/AuthContext"; // Contexto de autenticación
import { CartContext } from "@/context/CartContext"; // Contexto del carrito

export default function Header({ textColor = 'text-white', position = "absolute" }) { 
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isFavoritesOpen, setFavoritesOpen] = useState(false); // Estado para favoritos

  const { currentUser, authLoading } = useContext(AuthContext); // Obtener el usuario y estado de autenticación
  const { cartCount } = useContext(CartContext); // Obtener el conteo de productos del carrito

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/public/get/list');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategories(data.categories);

        // Crear subcategorías
        const subcats = {};
        data.categories.forEach(category => {
          if (category.subcategories) {
            subcats[category.uniqueID] = category.subcategories;
          }
        });
        setSubcategories(subcats);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchClick = () => setSearchOpen(true);
  const handleCartClick = () => setCartOpen(true);
  const handleFavoritesClick = () => setFavoritesOpen(true); // Abrir favoritos
  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const redirectProfile = () => {
    window.location.href = '/profile/user';
  }

  return (
    <header
      className={`${position} top-0 left-0 w-full z-50 ${isHovered ? "bg-white shadow-md" : "bg-transparent"} transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-lg font-bold">
          <Link href="/">
            <span className={`${isHovered ? "text-black" : textColor} text-xl`}>
              Mahets&#39;i & Boh&#39;o
            </span>
          </Link>
        </div>

        {/* Menú de Navegación para Pantallas Grandes */}
        <nav className="hidden md:flex space-x-6">
          {isLoading ? (
            <div className="flex gap-6">
              <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          ) : (
            categories.map((category) => {
              const filteredSubcategories = subcategories[category.uniqueID] || [];
              return (
                <div key={category.uniqueID} className="group relative">
                  <Link
                    href={`/category/${category.url}`}
                    className={`cursor-pointer ${isHovered ? "text-black" : textColor}`}
                    aria-label={`Categoría ${category.name}`}
                  >
                    {category.name}
                  </Link>
                  {filteredSubcategories.length > 0 && (
                    <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg p-4">
                      <ul>
                        {filteredSubcategories.map((subcat) => (
                          <li key={subcat.uniqueID}>
                            <Link 
                              href={`/category/${category.url}/${subcat.url}`} 
                              className="py-1 hover:text-gray-700 block"
                              aria-label={`Subcategoría ${subcat.name}`}
                            >
                              {subcat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <Link href="/contacto" className={`cursor-pointer ${isHovered ? "text-black" : textColor}`}>
            Contacto
          </Link>
        </nav>

        {/* Iconos y Menú Móvil */}
        <div className="flex items-center space-x-4">
          <FaSearch
            className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
            onClick={handleSearchClick}
            aria-label="Buscar"
          />
          <FaHeart
            className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
            onClick={handleFavoritesClick}
            aria-label="Favoritos"
          />
          {/* Condicional para Usuario */}
          {authLoading ? (
            <span className={`cursor-pointer ${isHovered ? "text-black" : textColor} hover:text-gray-700`}>
              Cargando...
            </span>
          ) : currentUser ? (
            <FaUser
              className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
              onClick={redirectProfile}
              aria-label="Perfil de usuario"
            />
          ) : (
            <Link href="/login" className={`cursor-pointer ${isHovered ? "text-black" : textColor} hover:text-gray-700`} aria-label="Ingresar">
              Ingresar
            </Link>
          )}
          <div className="relative">
            <FaShoppingCart
              className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
              onClick={handleCartClick}
              aria-label="Carrito de compras"
            />
            {cartCount > 0 && (
              <span
                className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center"
                aria-label={`Tienes ${cartCount} productos en el carrito`}
              >
                {cartCount}
              </span>
            )}
          </div>
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <FaTimes className={`text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`} />
            ) : (
              <FaBars className={`text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`} />
            )}
          </button>
        </div>
      </div>

      {/* Opciones para móviles */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col space-y-4 p-4">
            {categories.map((category) => {
              const filteredSubcategories = subcategories[category.uniqueID] || [];
              return (
                <li key={category.uniqueID}>
                  <Link href={`/category/${category.url}`} className="cursor-pointer hover:text-gray-700 block" aria-label={`Categoría ${category.name}`}>
                    {category.name}
                  </Link>
                  {filteredSubcategories.length > 0 && (
                    <ul className="pl-4 mt-2 space-y-2">
                      {filteredSubcategories.map((subcat) => (
                        <li key={subcat.uniqueID}>
                          <Link 
                            href={`/category/${category.url}/${subcat.url}`} 
                            className="cursor-pointer hover:text-gray-700 block text-sm"
                            aria-label={`Subcategoría ${subcat.name}`}
                          >
                            {subcat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li><Link href="/contacto" className="cursor-pointer hover:text-gray-700">Contacto</Link></li>
          </ul>
        </nav>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesModal isOpen={isFavoritesOpen} onClose={() => setFavoritesOpen(false)} />
    </header>
  );
}
