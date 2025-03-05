//Category/[categoryUrl]/[subcategoryURL]/page.js
'use client';

import { useParams } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import { IoOptions } from 'react-icons/io5';
import HeroSection from '../../HeroSection';
import CategoryFilter from '../../CategoryFilter';
import SubcategoryFilter from '../../SubcategoryFilter';
import PriceFilter from '../../PriceFilter';
import BrandFilter from '../../BrandFilter';
import ProductList from '../../ProductList';

// Hooks personalizados
import { useCategories } from '../../../../hooks/useCategories';
import { useBrandsAndTypes } from '../../../../hooks/useBrandsAndTypes';
import { useProducts } from '../../../../hooks/useProductsBySubcategory';
import { useFilters } from '../../../../hooks/useFilters';
import { useSubcategories } from '../../../../hooks/useSubcategories';
import { useSubcategoryByURL } from '../../../../hooks/useSubcategoryByURL'; // Nuevo hook

export default function CategoryPage() {
  const params = useParams();
  const categoryUrl = params.categoryUrl;
  const subcategoryURL = params.subcategoryURL; // Obtener subcategoryURL de los params

  // Obtener las categorías
  const { categories } = useCategories();

  // Si la categoría no existe, se toma la primera disponible
  const currentCategory = categories.find(cat => cat.url === categoryUrl) || categories[0];

  const { brands, types } = useBrandsAndTypes(currentCategory);
  
  // Usamos el hook para obtener la subcategoría según la URL (se espera un arreglo; usamos el primer elemento si existe)
  const { subcategory } = useSubcategoryByURL(currentCategory?.uniqueID, subcategoryURL);
 console.log("Esta es la subcategoria ",subcategory)
  // Se pasa el subcategoryID (si existe) al hook que obtiene los productos filtrados por subcategoría
  const { isLoadingProducts, products } = useProducts(
    currentCategory,
    subcategory && subcategory.length >= 1 ? subcategory[0]?.subcategoryID : null
  );

  // Los filtros (ya sin tallas)
  const {
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    isFilterOpen,
    setIsFilterOpen,
    selectedCategories,
    setSelectedCategories,
    selectedBrands,
    setSelectedBrands,
    selectedTypes,
    setSelectedTypes,
    selectedSubcategories,
    setSelectedSubcategories,
    clearAllFilters,
  } = useFilters();

  // Obtener todas las subcategorías de la categoría actual (para mostrarlas en la lista lateral)
  const { isLoadingSubcategories, subcategories } = useSubcategories(currentCategory?.uniqueID);

  // Funciones auxiliares para obtener nombres (para filtrar en cliente)
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

  // Función de filtrado en el cliente (se han eliminado los filtros por tallas)
  const filterProducts = () => {
    return products.filter(product => {
      const withinPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(getCategoryName(product.categoryID));
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(getBrandName(product.brandID));
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(getTypeName(product.typeID));
      const matchesSubcategory =
        selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategoryID);

      return withinPrice && matchesCategory && matchesBrand && matchesType && matchesSubcategory;
    });
  };

  const filteredProducts = filterProducts();

  return (
    <>
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
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              catURL={categoryUrl}
            />
            {/* Se activa el modo "link" para que cada subcategoría redirija a la URL correspondiente */}
            <SubcategoryFilter
              subcategories={subcategories}
              selectedSubcategories={selectedSubcategories}
              setSelectedSubcategories={setSelectedSubcategories}
              isLoadingSubcategories={isLoadingSubcategories}
              linkMode={true}   // Habilitamos el modo link
              catURL={categoryUrl} // Se necesita para construir la URL
            />
            <BrandFilter
              brands={brands}
              types={types}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
            />
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
            <ProductList
              products={filteredProducts}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedTypes={selectedTypes}
              selectedSubcategories={selectedSubcategories}
              minPrice={minPrice}
              maxPrice={maxPrice}
              clearAllFilters={clearAllFilters}
              setSelectedCategories={setSelectedCategories}
              setSelectedBrands={setSelectedBrands}
              setSelectedTypes={setSelectedTypes}
              setSelectedSubcategories={setSelectedSubcategories}
              loading={isLoadingProducts}
              brands={brands}
              types={types}
              subcategories={subcategories}
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

              <div className="max-h-[80vh] overflow-y-auto">
                <CategoryFilter
                  categories={categories.filter(cat => cat.uniqueID === currentCategory?.uniqueID)}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  catURL={categoryUrl}
                />
                <SubcategoryFilter
                  subcategories={subcategories}
                  selectedSubcategories={selectedSubcategories}
                  setSelectedSubcategories={setSelectedSubcategories}
                  isLoadingSubcategories={isLoadingSubcategories}
                  linkMode={true}
                  catURL={categoryUrl}
                />
                <BrandFilter
                  brands={brands}
                  types={types}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                />
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
