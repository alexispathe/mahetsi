// ProductPage.js
'use client';

import { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa'; // Importar íconos de react-icons
import CategoryFilter from '../CategoryFilter';
import PriceFilter from '../PriceFilter'; 
import BrandFilter from '../BrandFilter';
import ProductList from '../ProductList';
import Header from '../../components/Header';
import HeroSection from '../HeroSection';
import { products, categories, brands, types, subcategories } from '../data'; // Importar las colecciones

export default function ProductPage() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Estados para filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]); // Si no utilizas tallas en tus productos, puedes eliminar esto

  // Función para filtrar productos
  const filterProducts = () => {
    return products.filter(product => {
      const withinPrice = product.price >= minPrice && product.price <= maxPrice;

      // Obtener el nombre de la categoría y la subcategoría
      const productCategory = categories.find(cat => cat.uniqueID === product.categoryID);
      const productSubcategory = subcategories.find(subcat => subcat.uniqueID === product.subcategoryID);
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory?.name);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(getBrandName(product.brandID));
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(getTypeName(product.typeID));
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.size); // Asegúrate de que los productos tengan la propiedad 'size'

      return withinPrice && matchesCategory && matchesBrand && matchesType && matchesSize;
    });
  };

  // Funciones auxiliares para obtener nombres a partir de IDs
  const getBrandName = (brandID) => {
    const brand = brands.find(b => b.uniqueID === brandID);
    return brand ? brand.name : '';
  };

  const getTypeName = (typeID) => {
    const type = types.find(t => t.uniqueID === typeID);
    return type ? type.name : '';
  };

  const filteredProducts = filterProducts();

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    setMinPrice(0);
    setMaxPrice(1000);
  };

  // Controlar el scroll del body al abrir/cerrar el modal
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Limpiar el estilo al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);

  return (
    <>
      <Header textColor={'text-white'}/>
      <HeroSection />
      <div className="container mx-auto px-4 py-6">
        {/* Botón para abrir filtros en móviles */}
        <div className="flex justify-end mb-4 md:hidden">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaFilter className="w-5 h-5 mr-2" /> {/* Ícono de Filtros */}
            Filtros
          </button>
        </div>

        <div className="flex justify-center">
          {/* Filtro lateral en pantallas medianas y grandes */}
          <aside className="hidden md:block md:w-1/4 lg:w-1/5">
            <CategoryFilter 
              categories={categories} // Pasar las categorías
              selectedCategories={selectedCategories} 
              setSelectedCategories={setSelectedCategories} 
            />
            <PriceFilter 
              minPrice={minPrice} 
              maxPrice={maxPrice} 
              onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }} 
            />
            <BrandFilter 
              brands={brands} // Pasar las marcas
              types={types} // Pasar los tipos
              selectedBrands={selectedBrands} 
              setSelectedBrands={setSelectedBrands} 
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
            />
          </aside>

          <main className="w-full md:w-3/4 lg:w-9/12 xl:w-7/10 px-5 md:px-10 lg:px-10 sm:px-0">
            <ProductList 
              products={filteredProducts} 
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedTypes={selectedTypes}
              selectedSizes={selectedSizes}
              minPrice={minPrice}
              maxPrice={maxPrice}
              clearAllFilters={clearAllFilters}
              setSelectedCategories={setSelectedCategories}
              setSelectedBrands={setSelectedBrands}
              setSelectedTypes={setSelectedTypes}
              setSelectedSizes={setSelectedSizes}
            />
          </main>
        </div>

        {/* Modal de filtros para móviles */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto transition-opacity duration-300 ease-in-out">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 relative">
              {/* Botón de cierre */}
              <button 
                onClick={() => setIsFilterOpen(false)} 
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                aria-label="Cerrar filtros"
              >
                <FaTimes className="h-6 w-6" /> {/* Ícono de Cierre */}
              </button>
              <h2 className="text-xl font-semibold mb-4">Filtros</h2>
              <CategoryFilter 
                categories={categories} // Pasar las categorías
                selectedCategories={selectedCategories} 
                setSelectedCategories={setSelectedCategories} 
              />
              <PriceFilter 
                minPrice={minPrice} 
                maxPrice={maxPrice} 
                onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }} 
              />
              <BrandFilter 
                brands={brands} // Pasar las marcas
                types={types} // Pasar los tipos
                selectedBrands={selectedBrands} 
                setSelectedBrands={setSelectedBrands} 
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
              />
              <button
                onClick={() => setIsFilterOpen(false)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
