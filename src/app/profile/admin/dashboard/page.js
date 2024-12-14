// src/app/profile/dashboard/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();

  // Estados para datos
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [products, setProducts] = useState([]);

  // Estados para carga
  const [loading, setLoading] = useState({
    categories: true,
    subcategories: true,
    brands: true,
    types: true,
    products: true,
  });

  // Estados para errores
  const [error, setError] = useState({
    categories: null,
    subcategories: null,
    brands: null,
    types: null,
    products: null,
  });

  // Estados para colapsar secciones
  const [isOpen, setIsOpen] = useState({
    categories: false,
    subcategories: false,
    brands: false,
    types: false,
    products: false,
  });

  // Funciones para obtener datos
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories/private/get/list', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al cargar las categorías.');
      }
      const data = await res.json();
      setCategories(data.categories);
      setError(prev => ({ ...prev, categories: null }));
    } catch (err) {
      setError(prev => ({ ...prev, categories: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch('/api/categories/private/subCategories/get/list', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al cargar las subcategorías.');
      }
      const data = await res.json();
      setSubcategories(data.subcategories);
      setError(prev => ({ ...prev, subcategories: null }));
    } catch (err) {
      setError(prev => ({ ...prev, subcategories: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, subcategories: false }));
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands/private/get/list', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al cargar las marcas.');
      }
      const data = await res.json();
      setBrands(data.brands);
      setError(prev => ({ ...prev, brands: null }));
    } catch (err) {
      setError(prev => ({ ...prev, brands: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, brands: false }));
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch('/api/types/private/get/list', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al cargar los tipos.');
      }
      const data = await res.json();
      setTypes(data.types);
      setError(prev => ({ ...prev, types: null }));
    } catch (err) {
      setError(prev => ({ ...prev, types: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, types: false }));
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products/private/get/list', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al cargar los productos.');
      }
      const data = await res.json();
      setProducts(data.products);
      setError(prev => ({ ...prev, products: null }));
    } catch (err) {
      setError(prev => ({ ...prev, products: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // useEffect para cargar todos los datos al montar el componente
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchBrands();
    fetchTypes();
    fetchProducts();
  }, []);

  // Función para alternar la visibilidad de las secciones
  const toggleCollapse = (section) => {
    setIsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Panel de Administración</h1>
      
      {/* Secciones Desplegables */}
      <div className="space-y-6">
        {/* Categorías */}
        <div className="border rounded-lg shadow-sm">
          <button
            onClick={() => toggleCollapse('categories')}
            className="w-full flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg hover:bg-blue-600 focus:outline-none"
          >
            <span className="text-xl font-semibold">Categorías</span>
            <svg
              className={`w-6 h-6 transform transition-transform duration-200 ${isOpen.categories ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen.categories && (
            <div className="p-4 bg-white">
              <div className="mb-4">
                <button
                  onClick={() => router.push('/categories/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Categoría
                </button>
              </div>
              {loading.categories ? (
                <p className="text-gray-500">Cargando categorías...</p>
              ) : error.categories ? (
                <p className="text-red-500">Error: {error.categories}</p>
              ) : (
                <ul className="space-y-3">
                  {categories.map(category => (
                    <li key={category.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{category.name}</span>
                      <button
                        onClick={() => router.push(`/categories/update/${category.uniqueID}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200"
                      >
                        Actualizar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {/* Subcategorías */}
        <div className="border rounded-lg shadow-sm">
          <button
            onClick={() => toggleCollapse('subcategories')}
            className="w-full flex justify-between items-center p-4 bg-purple-500 text-white hover:bg-purple-600 focus:outline-none"
          >
            <span className="text-xl font-semibold">Subcategorías</span>
            <svg
              className={`w-6 h-6 transform transition-transform duration-200 ${isOpen.subcategories ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen.subcategories && (
            <div className="p-4 bg-white">
              <div className="mb-4">
                <button
                  onClick={() => router.push('/subcategories/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Subcategoría
                </button>
              </div>
              {loading.subcategories ? (
                <p className="text-gray-500">Cargando subcategorías...</p>
              ) : error.subcategories ? (
                <p className="text-red-500">Error: {error.subcategories}</p>
              ) : (
                <ul className="space-y-3">
                  {subcategories.map(subcategory => (
                    <li key={subcategory.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{subcategory.name}</span>
                      <button
                        onClick={() => router.push(`/subcategories/update/${subcategory.uniqueID}`)}
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors duration-200"
                      >
                        Actualizar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {/* Marcas */}
        <div className="border rounded-lg shadow-sm">
          <button
            onClick={() => toggleCollapse('brands')}
            className="w-full flex justify-between items-center p-4 bg-red-500 text-white hover:bg-red-600 focus:outline-none"
          >
            <span className="text-xl font-semibold">Marcas</span>
            <svg
              className={`w-6 h-6 transform transition-transform duration-200 ${isOpen.brands ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen.brands && (
            <div className="p-4 bg-white">
              <div className="mb-4">
                <button
                  onClick={() => router.push('/brands/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Marca
                </button>
              </div>
              {loading.brands ? (
                <p className="text-gray-500">Cargando marcas...</p>
              ) : error.brands ? (
                <p className="text-red-500">Error: {error.brands}</p>
              ) : (
                <ul className="space-y-3">
                  {brands.map(brand => (
                    <li key={brand.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{brand.name}</span>
                      <button
                        onClick={() => router.push(`/brands/update/${brand.uniqueID}`)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                      >
                        Actualizar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {/* Tipos */}
        <div className="border rounded-lg shadow-sm">
          <button
            onClick={() => toggleCollapse('types')}
            className="w-full flex justify-between items-center p-4 bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none"
          >
            <span className="text-xl font-semibold">Tipos</span>
            <svg
              className={`w-6 h-6 transform transition-transform duration-200 ${isOpen.types ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen.types && (
            <div className="p-4 bg-white">
              <div className="mb-4">
                <button
                  onClick={() => router.push('/types/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Tipo
                </button>
              </div>
              {loading.types ? (
                <p className="text-gray-500">Cargando tipos...</p>
              ) : error.types ? (
                <p className="text-red-500">Error: {error.types}</p>
              ) : (
                <ul className="space-y-3">
                  {types.map(type => (
                    <li key={type.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{type.name}</span>
                      <button
                        onClick={() => router.push(`/types/update/${type.uniqueID}`)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors duration-200"
                      >
                        Actualizar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {/* Productos */}
        <div className="border rounded-lg shadow-sm">
          <button
            onClick={() => toggleCollapse('products')}
            className="w-full flex justify-between items-center p-4 bg-green-500 text-white hover:bg-green-600 focus:outline-none"
          >
            <span className="text-xl font-semibold">Productos</span>
            <svg
              className={`w-6 h-6 transform transition-transform duration-200 ${isOpen.products ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen.products && (
            <div className="p-4 bg-white">
              <div className="mb-4">
                <button
                  onClick={() => router.push('/products/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Producto
                </button>
              </div>
              {loading.products ? (
                <p className="text-gray-500">Cargando productos...</p>
              ) : error.products ? (
                <p className="text-red-500">Error: {error.products}</p>
              ) : (
                <ul className="space-y-3">
                  {products.map(product => (
                    <li key={product.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{product.name}</span>
                      <button
                        onClick={() => router.push(`/products/update/${product.uniqueID}`)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-200"
                      >
                        Actualizar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
