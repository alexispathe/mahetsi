'use client'
import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchModal from "./components/SearchModal";
import CartDrawer from "./components/CartDrawer";

export default function HomePage() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  const handleSearchClick = () => setSearchOpen(true);
  const handleCartClick = () => setCartOpen(true);

  return (
    <div>
      <Header
        onSearchClick={handleSearchClick}
        onCartClick={handleCartClick}
      />
      <Hero />
      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
