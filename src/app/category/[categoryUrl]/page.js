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

export default function CategoryPage() {
  const params = useParams();
  const categoryUrl = params.categoryUrl;

  // Estados de carga
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Datos
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [products, setProducts] = useState([]);

  // Estados de filtros
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const currentCategory = categories.find(cat => cat.url === categoryUrl);

  // Obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetch('/api/categories/public/get/getAllCategories');
        if (!response.ok) throw new Error('Error al obtener las categorías');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Obtener brands y types cuando tengamos la categoría actual
  useEffect(() => {
    if (currentCategory) {
      const { uniqueID } = currentCategory;

      const fetchBrands = async () => {
        setIsLoadingBrands(true);
        try {
          const response = await fetch(`/api/brands/public/get/getBrandsByCategory?categoryID=${uniqueID}`);
          if (!response.ok) throw new Error('Error al obtener los brands');
          const data = await response.json();
          setBrands(data.brands);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingBrands(false);
        }
      };

      const fetchTypes = async () => {
        setIsLoadingTypes(true);
        try {
          const response = await fetch(`/api/types/public/get/getTypesByCategory?categoryID=${uniqueID}`);
          if (!response.ok) throw new Error('Error al obtener los types');
          const data = await response.json();
          setTypes(data.types);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingTypes(false);
        }
      };

      fetchBrands();
      fetchTypes();
    }
  }, [currentCategory]);

  // Función para obtener todos los productos desde el servidor
  const fetchAllProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch('/api/products/public/get/getAllProducts');
      if (!response.ok) throw new Error('Error al obtener todos los productos');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Obtener todos los productos cuando se carga la categoría actual
  useEffect(() => {
    if (currentCategory) {
      fetchAllProducts();
    }
  }, [currentCategory]);

  // Manejar el overflow del body al abrir/cerrar filtros
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

  // Función de filtrado en el cliente
  const filterProducts = () => {
    return products.filter(product => {
      // Filtrar por rango de precio
      const withinPrice = product.price >= minPrice && product.price <= maxPrice;

      // Filtrar por categorías seleccionadas
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(getCategoryName(product.categoryID));

      // Filtrar por marcas seleccionadas
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(getBrandName(product.brandID));

      // Filtrar por tipos seleccionados
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(getTypeName(product.typeID));

      // Filtrar por tallas seleccionadas
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.size);

      return withinPrice && matchesCategory && matchesBrand && matchesType && matchesSize;
    });
  };

  const getCategoryName = (categoryID) => {
    const category = categories.find(cat => cat.uniqueID === categoryID);
    return category ? category.name : '';
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
          {/* Barra lateral de filtros */}
          <aside className="hidden md:block md:w-1/4 lg:w-1/5">
            {isLoadingCategories ? (
              <div>cargando...</div>
            ) : (
              <CategoryFilter
                categories={categories.filter(cat => cat.uniqueID === currentCategory?.uniqueID)}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            )}

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
              onPriceChange={(min, max) => {
                setMinPrice(min); 
                setMaxPrice(max);
              }}
            />
          </aside>

          <main className="w-full md:w-3/4 lg:w-9/12 xl:w-7/10 px-5 md:px-10 lg:px-10 sm:px-0">
            {isLoadingProducts ? (
              <div>cargando...</div>
            ) : (
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
                loading={isLoadingProducts}
                brands={brands}
                types={types}
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

              <div className="max-h-[80vh] overflow-y-auto">
                {isLoadingCategories ? (
                  <div>cargando...</div>
                ) : (
                  <CategoryFilter
                    categories={categories.filter(cat => cat.uniqueID === currentCategory?.uniqueID)}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                  />
                )}

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
