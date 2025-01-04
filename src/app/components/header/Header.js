'use client';

import { useState, useEffect, useContext } from "react";
import Logo from './Logo';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import Icons from './Icons';
import SearchModal from '../SearchModal';
import CartDrawer from '../CartDrawer';
import FavoritesModal from '../FavoritesModal';
import { CartContext } from '@/context/CartContext';

export default function Header({ textColor = 'text-white', position = "absolute" }) { 
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isFavoritesOpen, setFavoritesOpen] = useState(false); 

  const { cartCount } = useContext(CartContext);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/public/get/list');
        if (!response.ok) throw new Error('Error al obtener las categorías');
        const data = await response.json();
        setCategories(data.categories);

        const subcats = {};
        data.categories.forEach(category => {
          if (category.subcategories) subcats[category.uniqueID] = category.subcategories;
        });
        setSubcategories(subcats);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const handleSearchClick = () => setSearchOpen(true);
  const handleCartClick = () => setCartOpen(true);
  const handleFavoritesClick = () => setFavoritesOpen(true);
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <header className={`${position} top-0 left-0 w-full z-50 ${isHovered ? "bg-white shadow-md" : "bg-transparent"} transition-all duration-300`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Logo isHovered={isHovered} textColor={textColor} />
        <Navigation categories={categories} subcategories={subcategories} isHovered={isHovered} textColor={textColor} isLoading={isLoading} />
        <Icons isHovered={isHovered} textColor={textColor} handleSearchClick={handleSearchClick} handleFavoritesClick={handleFavoritesClick} cartCount={cartCount} handleCartClick={handleCartClick} />
      </div>
      <MobileMenu categories={categories} subcategories={subcategories} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} isHovered={isHovered} textColor={textColor} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesModal isOpen={isFavoritesOpen} onClose={() => setFavoritesOpen(false)} />
    </header>
  );
}
