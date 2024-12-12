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
// Eliminamos la importación de brands y types desde data.js
// import { products, categories, brands, types } from '../data';
import { products } from '../data'; // Asegúrate de importar solo lo necesario

export default function CategoryPage() {
  const params = useParams();
  const categoryUrl = params.categoryUrl;

  // Estados para manejar las categorías y el estado de carga
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Estados para manejar los brands
  const [brands, setBrands] = useState([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);

  // Estados para manejar los types
  const [types, setTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

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

  // useEffect para obtener las categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/public/get/getAllCategories');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // useEffect para obtener los brands y types una vez que se tiene currentCategory
  useEffect(() => {
    if (currentCategory) {
      const { uniqueID } = currentCategory;

      // Función para obtener los brands
      const fetchBrands = async () => {
        setIsLoadingBrands(true);
        try {
          const response = await fetch(`/api/brands/public/get/getBrandsByCategory?categoryID=${uniqueID}`);
          if (!response.ok) {
            throw new Error('Error al obtener los brands');
          }
          const data = await response.json();
          setBrands(data.brands);
        } catch (error) {
          console.error('Error al obtener los brands:', error);
        } finally {
          setIsLoadingBrands(false);
        }
      };

      // Función para obtener los types
      const fetchTypes = async () => {
        setIsLoadingTypes(true);
        try {
          const response = await fetch(`/api/types/public/get/getTypesByCategory?categoryID=${uniqueID}`);
          if (!response.ok) {
            throw new Error('Error al obtener los types');
          }
          const data = await response.json();
          setTypes(data.types);
        } catch (error) {
          console.error('Error al obtener los types:', error);
        } finally {
          setIsLoadingTypes(false);
        }
      };

      fetchBrands();
      fetchTypes();
    }
  }, [currentCategory]);

  // useEffect para manejar el overflow del body al abrir/cerrar filtros
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

  if (!currentCategory && !isLoadingCategories) {
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
  const categoryID = currentCategory ? currentCategory.uniqueID : null;
  const filteredProductsByCategory = categoryID
    ? products.filter(p => p.categoryID === categoryID)
    : [];

  // Filtrar brands y types por categoryID ya no es necesario aquí
  // ya que los obtenemos desde las APIs

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
    const brand = brands.find(b => b.uniqueID === brandID);
    return brand ? brand.name : '';
  };

  const getTypeName = (typeID) => {
    const type = types.find(t => t.uniqueID === typeID);
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
            className="mx-auto w-[95%] bg-gray-200 flex items-center p-2 text-sm uppercase text-black"
          >
            <IoOptions className="w-4 h-4 mr-2 text-black" />
            <span className="text-left">Filtros</span>
          </button>
        </div>
        <div className="flex justify-center">
          {/* Filtro lateral en pantallas medianas y grandes */}
          <aside className="hidden md:block md:w-1/4 lg:w-1/5">
            {/* Mostrar "cargando..." mientras se cargan las categorías */}
            {isLoadingCategories ? (
              <div>cargando...</div>
            ) : (
              <CategoryFilter
                categories={categories.filter(cat => cat.uniqueID === categoryID)}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            )}

            {/* Mostrar "cargando..." mientras se cargan los brands */}
            {isLoadingBrands ? (
              <div className="mt-4">cargando...</div>
            ) : (
              <BrandFilter
                brands={brands}
                types={types}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
              />
            )}

            {/* Mostrar "cargando..." mientras se cargan los types */}
            {/* Si tienes un filtro separado para types, puedes agregarlo aquí.
                En este caso, asumimos que `BrandFilter` maneja los types. */}
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
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
                {/* Mostrar "cargando..." mientras se cargan las categorías */}
                {isLoadingCategories ? (
                  <div>cargando...</div>
                ) : (
                  <CategoryFilter
                    categories={categories.filter(cat => cat.uniqueID === categoryID)}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                  />
                )}

                {/* Mostrar "cargando..." mientras se cargan los brands */}
                {isLoadingBrands ? (
                  <div className="mt-4">cargando...</div>
                ) : (
                  <BrandFilter
                    brands={brands}
                    types={types}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    selectedSizes={selectedSizes}
                    setSelectedSizes={setSelectedSizes}
                  />
                )}

                <PriceFilter
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
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
