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
// Eliminada la importación de 'products', 'categories', y 'brands'
// Si usas alguna otra data local, mantenla
import { types } from '../data';

export default function CategoryPage() {
  const params = useParams();
  const categoryUrl = params.categoryUrl;

  // Estados para categorías
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // Estados para marcas
  const [brands, setBrands] = useState([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [brandsError, setBrandsError] = useState(null);

  // Estados para productos
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Estados para filtros
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Estados para filtros seleccionados
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Fetch de categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);

      try {
        const response = await fetch('/api/categories/public/get/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las categorías.');
        }

        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setCategoriesError(error.message);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Determinar la categoría actual después de obtener las categorías
  const currentCategory = categories.find(cat => cat.url === categoryUrl);

  // Fetch de marcas desde la API una vez que la categoría actual está definida
  useEffect(() => {
    const fetchBrands = async () => {
      if (!currentCategory) return;

      const categoryID = currentCategory.uniqueID;
      if (!categoryID) return;

      setIsLoadingBrands(true);
      setBrandsError(null);

      try {
        const response = await fetch(`/api/brands/public/get/byCategory/${categoryID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Categoría no encontrada.');
          } else {
            throw new Error('Error al obtener las marcas.');
          }
        }

        const data = await response.json();
        setBrands(data.brands);
      } catch (error) {
        console.error('Error al obtener las marcas:', error);
        setBrandsError(error.message);
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrands();
  }, [currentCategory]);

  // Fetch de productos desde la API con filtros
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentCategory) return;

      const categoryID = currentCategory.uniqueID;
      if (!categoryID) return;

      setIsLoadingProducts(true);
      setProductsError(null);

      try {
        // Construir la URL con los parámetros de filtrado
        const params = new URLSearchParams();

        if (selectedBrands.length > 0) {
          params.append('brandIDs', selectedBrands.join(','));
        }

        if (selectedTypes.length > 0) {
          params.append('typeIDs', selectedTypes.join(','));
        }

        if (minPrice) {
          params.append('minPrice', minPrice);
        }

        if (maxPrice !== 1000) { // Suponiendo que 1000 es el valor por defecto
          params.append('maxPrice', maxPrice);
        }

        if (selectedSizes.length > 0) {
          params.append('sizes', selectedSizes.join(','));
        }

        // Determinar el tipo ('category' o 'subcategory') y la URL
        let typeParam = 'category';
        let urlParam = currentCategory.url;

        // Si estás filtrando por subcategoría, ajusta el tipo y la URL
        // Esto depende de tu lógica de aplicación
        // Por ahora, asumiremos que siempre es 'category'

        const apiUrl = `/api/products/public/get/list/${typeParam}/${urlParam}?${params.toString()}`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No se encontraron productos.');
          } else {
            throw new Error('Error al obtener los productos.');
          }
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        setProductsError(error.message);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [currentCategory, selectedBrands, selectedTypes, minPrice, maxPrice, selectedSizes]);

  // useEffect para manejar el scroll cuando los filtros están abiertos
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

  // Manejo de caso donde la categoría no se encuentra o está cargando
  if (isLoadingCategories) {
    return (
      <>
        <Header textColor={'text-white'} />
        <HeroSection />
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold">Cargando categorías...</h2>
        </div>
      </>
    );
  }

  if (categoriesError) {
    return (
      <>
        <Header textColor={'text-white'} />
        <HeroSection />
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold text-red-500">Error: {categoriesError}</h2>
        </div>
      </>
    );
  }

  if (!currentCategory) {
    return (
      <>
        <Header textColor={'text-white'} />
        <HeroSection />
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold">Categoría no encontrada</h2>
        </div>
      </>
    );
  }

  // Filtrar types por categoryID
  const categoryID = currentCategory.uniqueID;
  const filteredTypes = types.filter(t => t.categoryID === categoryID);

  // Filtrar brands ya obtenido desde la API
  const filteredBrands = brands; // Ya filtrado por API

  // Función para obtener el nombre de la marca
  const getBrandName = (brandID) => {
    const brand = filteredBrands.find(b => b.uniqueID === brandID);
    return brand ? brand.name : '';
  };

  // Función para obtener el nombre del tipo
  const getTypeName = (typeID) => {
    const type = filteredTypes.find(t => t.uniqueID === typeID);
    return type ? type.name : '';
  };

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
            {isLoadingBrands ? (
              <div className="my-4 text-gray-600">Cargando marcas...</div>
            ) : brandsError ? (
              <div className="my-4 text-red-500">Error: {brandsError}</div>
            ) : (
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
            )}
          </aside>

          <main className="w-full md:w-3/4 lg:w-9/12 xl:w-7/10 px-5 md:px-10 lg:px-10 sm:px-0">
            {isLoadingProducts ? (
              <div className="text-center text-gray-600">Cargando productos...</div>
            ) : productsError ? (
              <div className="text-center text-red-500">Error: {productsError}</div>
            ) : (
              <ProductList
                products={products}
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
            )}
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

              {/* Contenedor con overflow para scroll */}
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
                {isLoadingBrands ? (
                  <div className="my-4 text-gray-600">Cargando marcas...</div>
                ) : brandsError ? (
                  <div className="my-4 text-red-500">Error: {brandsError}</div>
                ) : (
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
                )}
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
