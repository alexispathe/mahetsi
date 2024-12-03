import { useState } from "react";
import { FaSearch, FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";

export default function Header({ cartCount }) {
  const [isHovered, setIsHovered] = useState(false); // Define el estado de isHovered
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  const handleSearchClick = () => setSearchOpen(true);
  const handleCartClick = () => setCartOpen(true);

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
          <span className={`${isHovered ? "text-black" : "text-white"}`}>
            Mahets'i & Boho
          </span>
          </a>
         
        </div>

        {/* Categories */}
        <nav className="flex space-x-6">
          <div className="group relative">
            <span className={`cursor-pointer ${isHovered ? "text-black" : "text-white"}`}>
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
          <span className={`cursor-pointer ${isHovered ? "text-black" : "text-white"}`}>Jabones Orgánicos</span>
          <span className={`cursor-pointer ${isHovered ? "text-black" : "text-white"}`}>Contacto</span>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <FaSearch
            className={`cursor-pointer text-lg ${isHovered ? "text-black" : "text-white"} hover:text-gray-700`}
            onClick={handleSearchClick}
          />
          {/* Favorites Icon */}
          <FaHeart
            className={`cursor-pointer text-lg ${isHovered ? "text-black" : "text-white"} hover:text-gray-700`}
          />
          {/* User Icon */}
          <FaUser
            className={`cursor-pointer text-lg ${isHovered ? "text-black" : "text-white"} hover:text-gray-700`}
          />
          {/* Cart Icon */}
          <div className="relative">
            <FaShoppingCart
              className={`cursor-pointer text-lg ${isHovered ? "text-black" : "text-white"} hover:text-gray-700`}
              onClick={handleCartClick}
            />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-13px",
                  right: "-11px",
                  backgroundColor: "#F44336",
                  color: "white",
                  fontSize: "12px",
                  borderRadius: "10%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
