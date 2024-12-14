// src/app/profile/admin/dashboard/page.js
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

  // Estados para carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para colapsar secciones
  const [isOpen, setIsOpen] = useState({
    categories: false,
    subcategories: false,
    brands: false,
    types: false,
    products: false,
  });

  // Función para alternar la visibilidad de las secciones
  const toggleCollapse = (section) => {
    setIsOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Funciones para obtener datos
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories/private/get/list', {
        method: 'GET',
        credentials: 'include', // Incluye las cookies en la solicitud
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al cargar las categorías.');
      }
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
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
    } catch (err) {
      setError(err.message);
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
    } catch (err) {
      setError(err.message);
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
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products/private/product/get/list', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al cargar los productos.');
      }
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    }
  };

  // useEffect para verificar la sesión y permisos al montar el componente
  useEffect(() => {
    const verifySessionAndPermissions = async () => {
      try {
        const res = await fetch('/api/verify-session', {
          method: 'GET',
          credentials: 'include', // Incluye las cookies en la solicitud
        });

        if (res.status === 401) {
          // Usuario no autenticado o sesión expirada
          router.push('/login');
          return;
        }

        if (!res.ok) {
          // Otros errores
          const data = await res.json();
          throw new Error(data.message || 'Error al verificar la sesión.');
        }

        const data = await res.json();

        const userPermissions = data.user.permissions;

        // Verificar si el usuario tiene ambos permisos: "create" y "update"
        const hasCreate = userPermissions.includes('create');
        const hasUpdate = userPermissions.includes('update');

        if (hasCreate && hasUpdate) {
          // El usuario tiene los permisos necesarios, cargar los datos
          await fetchCategories();
          await fetchSubcategories();
          await fetchBrands();
          await fetchTypes();
          await fetchProducts();
        } else {
          // El usuario no tiene los permisos necesarios, redirigir al inicio
          router.push('/');
        }
      } catch (err) {
        console.error('Error en la verificación de sesión y permisos:', err);
        setError(err.message);
        router.push('/login'); // Redirigir al login en caso de error
      } finally {
        setLoading(false);
      }
    };

    verifySessionAndPermissions();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Panel de Administración</h1>
      
      {/* Secciones Desplegables */}
      <div className="space-y-6">
        {/* Categorías */}
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => toggleCollapse('categories')}
            className="w-full flex justify-between items-center p-4 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
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
                  onClick={() => router.push('categories/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Categoría
                </button>
              </div>
              {categories.length === 0 ? (
                <p className="text-gray-500">No hay categorías disponibles.</p>
              ) : (
                <ul className="space-y-3">
                  {categories.map(category => (
                    <li key={category.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{category.name}</span>
                      <button
                        onClick={() => router.push(`categories/update/${category.uniqueID}`)}
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
        <div className="border rounded-lg shadow-sm overflow-hidden">
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
                  onClick={() => router.push('subcategories/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Subcategoría
                </button>
              </div>
              {subcategories.length === 0 ? (
                <p className="text-gray-500">No hay subcategorías disponibles.</p>
              ) : (
                <ul className="space-y-3">
                  {subcategories.map(subcategory => (
                    <li key={subcategory.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{subcategory.name}</span>
                      <button
                        onClick={() => router.push(`subcategories/update/${subcategory.uniqueID}`)}
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
        <div className="border rounded-lg shadow-sm overflow-hidden">
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
                  onClick={() => router.push('brands/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Marca
                </button>
              </div>
              {brands.length === 0 ? (
                <p className="text-gray-500">No hay marcas disponibles.</p>
              ) : (
                <ul className="space-y-3">
                  {brands.map(brand => (
                    <li key={brand.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{brand.name}</span>
                      <button
                        onClick={() => router.push(`brands/update/${brand.uniqueID}`)}
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
        <div className="border rounded-lg shadow-sm overflow-hidden">
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
                  onClick={() => router.push('types/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Tipo
                </button>
              </div>
              {types.length === 0 ? (
                <p className="text-gray-500">No hay tipos disponibles.</p>
              ) : (
                <ul className="space-y-3">
                  {types.map(type => (
                    <li key={type.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{type.name}</span>
                      <button
                        onClick={() => router.push(`types/update/${type.uniqueID}`)}
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
        <div className="border rounded-lg shadow-sm overflow-hidden">
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
                  onClick={() => router.push('products/create')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Crear Producto
                </button>
              </div>
              {products.length === 0 ? (
                <p className="text-gray-500">No hay productos disponibles.</p>
              ) : (
                <ul className="space-y-3">
                  {products.map(product => (
                    <li key={product.uniqueID} className="flex justify-between items-center">
                      <span className="text-gray-700">{product.name}</span>
                      <button
                        onClick={() => router.push(`products/update/${product.uniqueID}`)}
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
