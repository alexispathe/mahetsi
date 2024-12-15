// src/app/profile/admin/products/create/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateProduct = () => {
  const router = useRouter();
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
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/verify-session', {
          method: 'GET',
          credentials: 'include', // Incluye las cookies en la solicitud
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user.permissions.includes('create')) {
            setHasPermission(true);
            await loadCategories();
          } else {
            router.push('/not-found'); // Redirige si no tiene permiso
          }
        } else {
          router.push('/login'); // Redirige si no está autenticado
        }
      } catch (err) {
        console.error('Error al verificar la sesión:', err);
        setError('Error al verificar la sesión.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [router]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories/private/get/list', {
        method: 'GET',
        credentials: 'include', // Incluye las cookies en la solicitud
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

  const loadSubcategories = async (categoryID) => {
    try {
      const response = await fetch(`/api/categories/private/subCategories/get/list/${categoryID}`, {
        method: 'GET',
        credentials: 'include', // Incluye las cookies en la solicitud
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

  const loadBrands = async (categoryID) => {
    try {
      const response = await fetch(`/api/brands/private/get/byCategory/${categoryID}`, {
        method: 'GET',
        credentials: 'include', // Incluye las cookies en la solicitud
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

  const loadTypes = async (categoryID) => {
    try {
      const response = await fetch(`/api/types/private/get/byCategory/${categoryID}`, {
        method: 'GET',
        credentials: 'include', // Incluye las cookies en la solicitud
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

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'images') {
      const images = [...productData.images];
      images[index] = value;
      setProductData({ ...productData, images });
    } else if (name === 'categoryID') {
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
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const addImageField = () => {
    setProductData({ ...productData, images: [...productData.images, ''] });
  };

  const removeImageField = (index) => {
    const images = [...productData.images];
    images.splice(index, 1);
    setProductData({ ...productData, images });
  };

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
        credentials: 'include', // Incluye las cookies en la solicitud
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el producto.');
      }

      const responseData = await response.json();
      alert(`Producto creado correctamente. URL: ${responseData.url}`);
      router.push('/profile/admin/dashboard'); // Redirige al perfil o a la página deseada
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        {error ? <p className="text-red-500 mb-2">{error}</p> : <p>No tienes permisos para crear productos.</p>}
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
                  {subcategory.name}
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
