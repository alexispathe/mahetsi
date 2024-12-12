'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import { IoOptions } from "react-icons/io5";
import CategoryFilter from '../CategoryFilter';
import PriceFilter from '../PriceFilter';
import BrandFilter from '../BrandFilter';
import ProductList from '../ProductList';
import Header from '../../components/Header';
import HeroSection from '../HeroSection';
import { products, categories, brands, types } from '../data';

export default function CategoryPage() {
  const params = useParams();
  const categoryUrl = params.categoryUrl;

  // Llamada a los hooks antes de cualquier condicional
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Estados para filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Buscar la categoría por su url
  const currentCategory = categories.find(cat => cat.url === categoryUrl);

  // useEffect antes de cualquier return condicional
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);

  if (!currentCategory) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold">Categoría no encontrada</h2>
        </div>
      </>
    );
  }

  // Filtrar productos por la categoría actual
  const categoryID = currentCategory.uniqueID;
  const filteredProductsByCategory = products.filter(p => p.categoryID === categoryID);

  // Filtrar brands y types por categoryID
  const filteredBrands = brands.filter(b => b.categoryID === categoryID);
  const filteredTypes = types.filter(t => t.categoryID === categoryID);

  const filterProducts = () => {
    return filteredProductsByCategory.filter(product => {
      const withinPrice = product.price >= minPrice && product.price <= maxPrice;

      const productCategory = categories.find(cat => cat.uniqueID === product.categoryID);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory?.name);

      const brandName = getBrandName(product.brandID);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(brandName);

      const typeName = getTypeName(product.typeID);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(typeName);

      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.size);

      return withinPrice && matchesCategory && matchesBrand && matchesType && matchesSize;
    });
  };

  const getBrandName = (brandID) => {
    const brand = filteredBrands.find(b => b.uniqueID === brandID);
    return brand ? brand.name : '';
  };

  const getTypeName = (typeID) => {
    const type = filteredTypes.find(t => t.uniqueID === typeID);
    return type ? type.name : '';
  };

  const filteredProducts = filterProducts();

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    setMinPrice(0);
    setMaxPrice(1000);
  };

  return (
    <>
      <Header textColor={'text-white'} />
      <HeroSection />
      <div className="container mx-auto px-4 py-6">
        {/* Botón para abrir filtros en móviles */}
        <div className="flex justify-end mb-4 md:hidden">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="mx-auto w-[95%] bg-gray-200 flex items-center p-2 text-sm  uppercase text-black"
          >
            <IoOptions className="w-4 h-4 mr-2 text-black" />
            <span className="text-left">Filtros</span>
          </button>
        </div>
        <div className="flex justify-center">
          {/* Filtro lateral en pantallas medianas y grandes */}
          <aside className="hidden md:block md:w-1/4 lg:w-1/5">
            <CategoryFilter
              categories={categories.filter(cat => cat.uniqueID === categoryID)}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
            />
            <BrandFilter
              brands={filteredBrands}
              types={filteredTypes}
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
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto transition-opacity duration-300 ease-in-out">
            <div className="relative max-w-md w-full mx-auto mt-10 p-6 bg-white rounded-lg">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                aria-label="Cerrar filtros"
              >
                <FaTimes className="h-6 w-6 text-black" />
              </button>

              {/* Aquí puedes poner un div adicional con overflow para asegurarte del scroll */}
              <div className="max-h-[80vh] overflow-y-auto">
                <CategoryFilter
                  categories={categories.filter(cat => cat.uniqueID === categoryID)}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
                <PriceFilter
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
                />
                <BrandFilter
                  brands={filteredBrands}
                  types={filteredTypes}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                />
              </div>

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
