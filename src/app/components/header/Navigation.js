import Link from "next/link";
import React, { useState } from "react";

export default function Navigation({
  categories = [],
  subcategories = {},
  isHovered = false,
  textColor = "text-white",
  isLoading = false,
}) {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  return (
    <nav className="hidden md:flex space-x-6">
      {isLoading ? (
        <div className="flex gap-6">
          {/* Skeleton de carga */}
          <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      ) : (
        categories.map((category) => {
          const filteredSubcategories = subcategories[category.uniqueID] || [];
          return (
            <div
              key={category.uniqueID}
              className="group relative"
              onMouseEnter={() => setActiveSubMenu(category.uniqueID)}
              onMouseLeave={() => setActiveSubMenu(null)}
            >
              {/* Enlace de la categoría principal */}
              <Link
                href={`/category/${category.url}`}
                className={`cursor-pointer ${isHovered ? "text-black" : textColor} hover:text-yellow-500`}
                aria-label={`Categoría ${category.name}`}
              >
                {category.name}
              </Link>

              {/* Submenú desplegable */}
              {filteredSubcategories.length > 0 && (
                <div
                  className={`
                    fixed top-0 left-0
                    ${activeSubMenu === category.uniqueID ? "opacity-100 visible" : "opacity-0 invisible"}
                    transition-all duration-500
                    w-screen h-[250px] shadow-lg bg-white
                    py-8
                    mt-[50px]
                  `}
                >
                  {/* Contenedor que controla el layout con flex */}
                  <div className="flex justify-between h-full px-4">
                    {/* Sección izquierda: subcategorías */}
                    <div className="min-w-[400px] h-full overflow-y-auto">
                      <h3 className="uppercase text-gray-400 mb-4 text-sm tracking-wider">
                        {category.name} {/* Cambia esto según tu gusto */}
                      </h3>
                      <div className="grid grid-cols-3">
                        {/* Subcategorías distribuidas en 3 columnas */}
                        {filteredSubcategories.map((subcat, index) => (
                          <div key={subcat.uniqueID} className="flex items-start">
                            <Link
                              href={`/category/${category.url}/${subcat.url}`}
                              className="py-1 hover:text-yellow-500 block"
                              aria-label={`Subcategoría ${subcat.name}`}
                            >
                              {subcat.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sección derecha: imagen o banner */}
                    <div className="absolute right-0 top-0 w-[500px] h-full overflow-hidden">
                      <img
                        src="https://mahetsipage.web.app/assets/images/banners/rom3.png"
                        alt={`${category.name} banner`}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Link fijo de Contacto */}
      <Link
        href="/contacto"
        className={`cursor-pointer ${isHovered ? "text-black" : textColor} hover:text-yellow-500`}
      >
        Contacto
      </Link>
    </nav>
  );
}
