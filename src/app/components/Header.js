import { useState } from "react";
import { FaSearch, FaHeart, FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import '../styles/header.css'
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";

export default function Header({ cartCount, textColor}) { // default a 'text-white'
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleSearchClick = () => setSearchOpen(true);
  const handleCartClick = () => setCartOpen(true);
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${isHovered ? "bg-white shadow-md" : "bg-transparent"} transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-lg font-bold">
          <a href="/">
            <span className={`${isHovered ? "text-black" : textColor} text-xl`}>
              Mahets'i & Boho
            </span>
          </a>
        </div>

        {/* Menú de Navegación para Pantallas Grandes */}
        <nav className="hidden md:flex space-x-6">
          <div className="group relative">
            <span className={`cursor-pointer ${isHovered ? "text-black" : textColor}`}>
              Shampoos Sólidos
            </span>
            {/* Submenu */}
            <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg p-4">
              <ul>
                <li className="py-1 hover:text-gray-700">Hidratación Profunda</li>
                <li className="py-1 hover:text-gray-700">Para Hombre</li>
                <li className="py-1 hover:text-gray-700">Veganos</li>
              </ul>
            </div>
          </div>
          <span className={`cursor-pointer ${isHovered ? "text-black" : textColor}`}>Jabones Orgánicos</span>
          <span className={`cursor-pointer ${isHovered ? "text-black" : textColor}`}>Contacto</span>
        </nav>

        {/* Iconos y Menú Móvil */}
        <div className="flex items-center space-x-4">
          {/* Icono de Búsqueda */}
          <FaSearch
            className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
            onClick={handleSearchClick}
          />
          {/* Icono de Favoritos */}
          <FaHeart
            className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
          />
          {/* Icono de Usuario */}
          <FaUser
            className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
          />
          {/* Icono de Carrito */}
          <div className="relative">
            <FaShoppingCart
              className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
              onClick={handleCartClick}
            />
            {cartCount > 0 && (
              <span
                className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center"
              >
                {cartCount}
              </span>
            )}
          </div>
          {/* Icono de Menú Hamburguesa (Visible en Móviles) */}
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

      {/* Menú Móvil */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col space-y-4 p-4">
            <li className="cursor-pointer hover:text-gray-700">Shampoos Sólidos</li>
            <li className="cursor-pointer hover:text-gray-700">Jabones Orgánicos</li>
            <li className="cursor-pointer hover:text-gray-700">Contacto</li>
          </ul>
        </nav>
      )}

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
