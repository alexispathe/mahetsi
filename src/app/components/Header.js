import { useState } from "react";

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${
        isHovered ? "bg-white shadow-md" : "bg-transparent"
      } transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="text-lg font-bold">Mahetsi & Boho</div>
          {/* Categories */}
          <nav className="flex space-x-6">
            <div className="group relative">
              <span className="cursor-pointer">Shampoos Sólidos</span>
              {/* Submenu */}
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg p-4">
                <ul>
                  <li>Hidratación Profunda</li>
                  <li>Para Hombre</li>
                  <li>Veganos</li>
                  {/* Add more categories */}
                </ul>
              </div>
            </div>
            <span>Jabones Orgánicos</span>
            <span>Contacto</span>
          </nav>
        </div>
        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button>🔍</button>
          <button>🤍</button>
          <button>👤</button>
          <button>🛒</button>
        </div>
      </div>
    </header>
  );
}
