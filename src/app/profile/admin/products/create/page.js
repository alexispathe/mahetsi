// src/app/profile/admin/products/create/page.js
"use client";

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext'; // <-- Importa tu AuthContext
import { toast } from 'react-toastify';
const CreateProduct = () => {
  const { currentUser, authLoading, sessionInitializing } = useContext(AuthContext);
  const router = useRouter();

  // Estado del formulario
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryID: '',
    subcategoryID: '',
    brandID: '',
    typeID: '',
    images: [''],
  });

  // Catálogos
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);

  // Estados de error y envío
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Para manejar el botón y mostrar "Cargando..."

  // Verificamos si tiene permiso de 'create'
  const hasPermission = currentUser?.permissions?.includes('create');

  // Efecto para verificar autenticación/permiso y cargar categorías
  useEffect(() => {
    if (!authLoading && !sessionInitializing) {
      if (!currentUser) {
        router.push('/login'); // Redirige si no está autenticado
      } else if (!hasPermission) {
        router.push('/not-found'); // Redirige si no tiene permiso
      } else {
        loadCategories(); // Cargamos las categorías si está todo OK
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, sessionInitializing, currentUser, hasPermission]);

  // Carga de categorías
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories/private/get/list', {
        method: 'GET',
        credentials: 'include', // Incluye las cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar las categorías.');
      }

      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      console.error('Error al cargar las categorías:', err);
      setError(err.message);
    }
  };

  // Carga de subcategorías
  const loadSubcategories = async (categoryID) => {
    try {
      const response = await fetch(`/api/categories/private/subCategories/get/list/${categoryID}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar las subcategorías.');
      }

      const data = await response.json();
      setSubcategories(data.subcategories);
    } catch (err) {
      console.error('Error al cargar las subcategorías:', err);
      setError(err.message);
    }
  };

  // Carga de marcas
  const loadBrands = async (categoryID) => {
    try {
      const response = await fetch(`/api/brands/private/get/byCategory/${categoryID}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar las marcas.');
      }

      const data = await response.json();
      setBrands(data.brands);
    } catch (err) {
      console.error('Error al cargar las marcas:', err);
      setError(err.message);
    }
  };

  // Carga de tipos
  const loadTypes = async (categoryID) => {
    try {
      const response = await fetch(`/api/types/private/get/byCategory/${categoryID}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar los tipos.');
      }

      const data = await response.json();
      setTypes(data.types);
    } catch (err) {
      console.error('Error al cargar los tipos:', err);
      setError(err.message);
    }
  };

  // Manejo de cambios en el formulario
  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    // Manejo de imágenes
    if (name === 'images') {
      const images = [...productData.images];
      images[index] = value;
      setProductData({ ...productData, images });
      return;
    }

    // Si cambia la categoría, reseteamos subcategoría, marca y tipo
    if (name === 'categoryID') {
      setProductData({
        ...productData,
        categoryID: value,
        subcategoryID: '',
        brandID: '',
        typeID: '',
      });

      if (value) {
        loadSubcategories(value);
        loadBrands(value);
        loadTypes(value);
      } else {
        setSubcategories([]);
        setBrands([]);
        setTypes([]);
      }
      return;
    }

    // Para el resto de campos
    setProductData({ ...productData, [name]: value });
  };

  // Agregar campo de imagen
  const addImageField = () => {
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  // Eliminar campo de imagen
  const removeImageField = (index) => {
    const images = [...productData.images];
    images.splice(index, 1);
    setProductData({ ...productData, images });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!productData.name.trim()) {
      setError('Por favor, ingresa un nombre válido para el producto.');
      return;
    }

    if (!productData.price || isNaN(productData.price) || Number(productData.price) <= 0) {
      setError('Por favor, ingresa un precio válido para el producto.');
      return;
    }

    if (!productData.stockQuantity || isNaN(productData.stockQuantity) || Number(productData.stockQuantity) < 0) {
      setError('Por favor, ingresa una cantidad de stock válida.');
      return;
    }

    if (!productData.categoryID) {
      setError('Por favor, selecciona una categoría.');
      return;
    }

    if (!productData.subcategoryID) {
      setError('Por favor, selecciona una subcategoría.');
      return;
    }

    if (!productData.brandID) {
      setError('Por favor, selecciona una marca.');
      return;
    }

    if (!productData.typeID) {
      setError('Por favor, selecciona un tipo.');
      return;
    }

    // Filtrar imágenes vacías
    const images = productData.images.filter((img) => img.trim() !== '');

    // Deshabilitamos el botón y mostramos "Cargando..."
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/products/private/product/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: Number(productData.price),
          stockQuantity: Number(productData.stockQuantity),
          categoryID: productData.categoryID,
          subcategoryID: productData.subcategoryID,
          brandID: productData.brandID,
          typeID: productData.typeID,
          images: images,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el producto.');
      }
      toast.success(
        <div className="flex items-center">
          <span>Producto creado correctamente.</span>
        </div>,
        {
          theme: "light",
          icon: true, 
        }
      );
      router.push('/profile/admin/dashboard'); // Redirige al perfil o a la página deseada
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false); // Volvemos a habilitar el botón
    }
  };

  /**
   * 1. MIENTRAS authLoading O sessionInitializing -> Spinner full screen
   * 2. Si no tiene permisos -> Mensaje
   * 3. Si todo OK -> Render formulario
   */

  if (authLoading || sessionInitializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        {error ? (
          <p className="text-red-500 mb-2">{error}</p>
        ) : (
          <p>No tienes permisos para crear productos.</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Crear Nuevo Producto</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Nombre del Producto */}
        <div className="mb-4">
          <label className="block mb-1">Nombre del Producto</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Descripción del Producto */}
        <div className="mb-4">
          <label className="block mb-1">Descripción Detallada</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Precio del Producto */}
        <div className="mb-4">
          <label className="block mb-1">Precio</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        {/* Cantidad de Stock */}
        <div className="mb-4">
          <label className="block mb-1">Cantidad en Inventario</label>
          <input
            type="number"
            name="stockQuantity"
            value={productData.stockQuantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min="0"
            step="1"
            required
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block mb-1">Categoría</label>
          <select
            name="categoryID"
            value={productData.categoryID}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.uniqueID} value={category.uniqueID}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategoría */}
        {subcategories.length > 0 && (
          <div className="mb-4">
            <label className="block mb-1">Subcategoría</label>
            <select
              name="subcategoryID"
              value={productData.subcategoryID}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Selecciona una subcategoría</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.subCategoryID} value={subcategory.subCategoryID}>
                  {"Hola"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Marca */}
        {brands.length > 0 && (
          <div className="mb-4">
            <label className="block mb-1">Marca</label>
            <select
              name="brandID"
              value={productData.brandID}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Selecciona una marca</option>
              {brands.map((brand) => (
                <option key={brand.uniqueID} value={brand.uniqueID}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tipo */}
        {types.length > 0 && (
          <div className="mb-4">
            <label className="block mb-1">Tipo</label>
            <select
              name="typeID"
              value={productData.typeID}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Selecciona un tipo</option>
              {types.map((type) => (
                <option key={type.uniqueID} value={type.uniqueID}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Imágenes del Producto */}
        <div className="mb-4">
          <label className="block mb-1">Imágenes del Producto</label>
          {productData.images.map((image, index) => (
            <div key={index} className="flex mb-2 items-center">
              <input
                type="text"
                name="images"
                value={image}
                onChange={(e) => handleChange(e, index)}
                className="w-full border px-3 py-2 rounded"
                placeholder="URL de la imagen"
                required
              />
              {productData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="ml-2 text-red-500"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 text-blue-500"
          >
            Añadir otra imagen
          </button>
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Cargando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;

