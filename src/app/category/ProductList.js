'use client';
import { useState, useMemo, useContext } from 'react';
import { FaTimes, FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; 
import Link from 'next/link'; 
import Pagination from './Pagination';
import Image from 'next/image';
import { AuthContext } from '@/context/AuthContext'; 
import { CartContext } from '@/context/CartContext/CartContext';
import { FavoritesContext } from '@/context/FavoritesContext';

import { toast } from 'react-toastify';

export default function ProductList({ 
  products, 
  selectedCategories,
  selectedBrands,
  selectedTypes,
  selectedSubcategories,
  setSelectedSubcategories,
  minPrice,
  maxPrice,
  clearAllFilters,
  setSelectedCategories,
  setSelectedBrands,
  setSelectedTypes,
  loading,
  brands,
  types,
  subcategories,
}) {
  // Estados generales
  const [sortOption, setSortOption] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Contextos
  const { currentUser } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext); 
  const { addFavorite, removeFavorite, favoriteIDs } = useContext(FavoritesContext); 

  // Estados para botones de carga
  const [cartLoading, setCartLoading] = useState({});
  const [favoriteLoading, setFavoriteLoading] = useState({});

  // Crear mapa de subcategorías
  const subcategoryMap = useMemo(() => {
    const map = {};
    subcategories.forEach(sub => {
      map[sub.uniqueID] = sub.name;
    });
    return map;
  }, [subcategories]);

  // Ordenar productos
  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    if (sortOption === 'price: hi low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'price: low hi') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [products, sortOption]);

  const removeFilter = (type, value) => {
    if (type === 'Category') {
      setSelectedCategories(selectedCategories.filter(item => item !== value));
    } else if (type === 'Brand') {
      setSelectedBrands(selectedBrands.filter(item => item !== value));
    } else if (type === 'Type') {
      setSelectedTypes(selectedTypes.filter(item => item !== value));
    } else if (type === 'Subcategory') {
      setSelectedSubcategories(selectedSubcategories.filter(item => item !== value));
    } else if (type === 'Ordenar por') {
      setSortOption('');
    }
  };

  const activeFilters = useMemo(() => {
    const filters = [
      ...selectedCategories.map(category => ({ type: 'Category', value: category })),
      ...selectedBrands.map(brand => ({ type: 'Brand', value: brand })),
      ...selectedTypes.map(type => ({ type: 'Type', value: type })),
      ...selectedSubcategories.map(subcategory => ({ type: 'Subcategory', value: subcategory })),
    ];
    if (minPrice > 0 || maxPrice < 1000) {
      filters.push({ type: 'Price', value: `${minPrice} - ${maxPrice}` });
    }
    if (sortOption) {
      filters.push({ type: 'Ordenar por', value: sortOption.toUpperCase() });
    }
    return filters;
  }, [selectedCategories, selectedBrands, selectedTypes, selectedSubcategories, minPrice, maxPrice, sortOption]);

  // Paginación
  const totalPages = useMemo(() => Math.ceil(sortedProducts.length / productsPerPage), [sortedProducts.length, productsPerPage]);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = useMemo(() => sortedProducts.slice(startIndex, endIndex), [sortedProducts, startIndex, endIndex]);

  const handleSort = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  // Funciones para agregar al carrito
  const handleAddToCart = async (productUniqueID) => {
    setCartLoading(prev => ({ ...prev, [productUniqueID]: true }));
    const cartItem = {
      uniqueID: productUniqueID,
      qty: 1
    };
    
    try {
      await addItemToCart(cartItem);
      const product = products.find((p) => p.uniqueID === productUniqueID);
      if (product) {
        toast.success(
          <div className="flex items-center">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              width={50} 
              height={50} 
              className="mr-2 rounded"
            />
            <span>{product.name} ha sido añadido al carrito.</span>
          </div>,
          {
            theme: "light",
            icon: false,
          }
        );
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error(`Error al agregar al carrito: ${error.message}`);
    } finally {
      setCartLoading(prev => ({ ...prev, [productUniqueID]: false }));
    }
  };

  // Funciones para alternar favorito
  const handleToggleFavorite = async (productUniqueID) => {
    setFavoriteLoading(prev => ({ ...prev, [productUniqueID]: true }));
    try {
      if (favoriteIDs.includes(productUniqueID)) {
        await removeFavorite(productUniqueID);
        const product = products.find((p) => p.uniqueID === productUniqueID);
        if (product) {
          toast.error(
            <div className="flex items-center">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                width={50} 
                height={50} 
                className="mr-2 rounded"
              />
              <span>{product.name} ha sido eliminado de tus favoritos.</span>
            </div>,
            {
              theme: 'light',
              icon: false,
            }
          );
        }
      } else {
        await addFavorite(productUniqueID);
        const product = products.find((p) => p.uniqueID === productUniqueID);
        if (product) {
          toast.success(
            <div className="flex items-center">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                width={50} 
                height={50} 
                className="mr-2 rounded"
              />
              <span>{product.name} ha sido añadido a tus favoritos.</span>
            </div>,
            {
              theme: 'light',
              icon: false,
            }
          );
        }
      }
    } catch (error) {
      console.error('Error al alternar favorito:', error);
      toast.error(`Error al alternar favorito: ${error.message}`);
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [productUniqueID]: false }));
    }
  };

  // Renderizar estrellas basado en averageRating
  const renderStars = (averageRating) => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
    }
    return stars;
  };

  return (
    <div>
      {/* Header de Filtro y Orden */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Filtros Activos */}
        <div className="flex items-center flex-wrap mb-2 sm:mb-0">
          <span className="mr-2 text-xs text-gray-600">Filtrado por:</span>
          {activeFilters.map((filter, index) => (
            <span key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded-md mr-2 mb-2">
              <span className="text-xs">
                {filter.type}: 
                {filter.type === 'Subcategory' 
                  ? ` ${subcategoryMap[filter.value] || 'Desconocida'}` 
                  : ` ${filter.value}`}
              </span>
              <button
                onClick={() => removeFilter(filter.type, filter.value)}
                className="ml-1 text-red-500 font-bold text-xs"
                aria-label={`Remove ${filter.type} filter`}
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </span>
          ))}
          {activeFilters.length > 0 && (
            <button 
              onClick={clearAllFilters} 
              className="text-blue-500 underline text-xs"
            >
              Limpiar Todo
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            className="bg-gray-200 px-4 py-2 rounded-md text-xs flex items-center"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            ORDENAR POR 
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-10">
              <button
                onClick={() => handleSort('price: hi low')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
              >
                PRECIO: MAYOR A MENOR
              </button>
              <button
                onClick={() => handleSort('price: low hi')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
              >
                PRECIO: MENOR A MAYOR
              </button>
              <button
                onClick={() => handleSort('name')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-xs"
              >
                NOMBRE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(productsPerPage).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md">
              <div className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                <div className="bg-gray-300 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-300 h-4 w-1/2 mb-2"></div>
                <div className="bg-gray-300 h-4 w-2/3"></div>
              </div>
            </div>
          ))
        ) : (
          currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.uniqueID} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
                <Link href={`/product/${product.url}`} className="block">
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    width={500} 
                    height={500} 
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                  <div className="flex justify-center mt-2">
                    <div className="flex">{renderStars(product.averageRating)}</div>
                    <span className="text-xs text-gray-600 ml-2">({product.numReviews})</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">{product.name}</h4>
                </Link>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleToggleFavorite(product.uniqueID)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                      aria-label={favoriteIDs.includes(product.uniqueID) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                      disabled={favoriteLoading[product.uniqueID]}
                    >
                      {favoriteLoading[product.uniqueID] ? (
                        <FaHeart className="h-5 w-5 animate-pulse" />
                      ) : (
                        favoriteIDs.includes(product.uniqueID) ? 
                          <FaHeart className="h-5 w-5" /> : 
                          <FaRegHeart className="h-5 w-5" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleAddToCart(product.uniqueID)}
                      className="text-gray-800 hover:text-gray-600 transition-colors duration-300"
                      aria-label="Agregar al carrito"
                      disabled={cartLoading[product.uniqueID]}
                    >
                      {cartLoading[product.uniqueID] ? (
                        <FaShoppingCart className="h-5 w-5 animate-pulse" alt="agregar al carrito" />
                      ) : (
                        <FaShoppingCart className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">No se encontraron productos con los filtros seleccionados.</div>
          )
        )}
      </div>

      {!loading && totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}

    </div>
  );
}
