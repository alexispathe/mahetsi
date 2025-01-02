// src/app/profile/admin/products/update/UpdateProductForm.js
"use client";

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const UpdateProductForm = ({ url, categories = [], onSuccess }) => {
  const { currentUser } = useContext(AuthContext);

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
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingType, setLoadingType] = useState(true);

  // Función para cargar subcategorías cuando se selecciona una categoría
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

  // Función para cargar marcas cuando se selecciona una categoría
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

  // Función para cargar tipos cuando se selecciona una categoría
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

  // Cargar datos del producto
  const loadProductData = async (productUrl) => {
    try {
      const response = await fetch(`/api/products/private/product/get/${productUrl}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar el producto.');
      }

      const data = await response.json();
      setProductData({
        name: data.name,
        description: data.description || '',
        price: data.price,
        stockQuantity: data.stockQuantity,
        categoryID: data.categoryID,
        subcategoryID: data.subcategoryID,
        brandID: data.brandID,
        typeID: data.typeID,
        images: data.images.length > 0 ? data.images : [''],
      });

      // Cargar también subcategorías, marcas y tipos de esa categoría
      await loadSubcategories(data.categoryID);
      await loadBrands(data.categoryID);
      await loadTypes(data.categoryID);
    } catch (err) {
      console.error('Error al cargar el producto:', err);
      setError(err.message);
    } finally {
      setLoadingType(false);
    }
  };

  // Efecto para cargar datos del producto al montar el componente
  useEffect(() => {
    if (url) {
      loadProductData(url);
    } else {
      setError('URL de producto inválida.');
      setLoadingType(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

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

    if (
      !productData.stockQuantity ||
      isNaN(productData.stockQuantity) ||
      Number(productData.stockQuantity) < 0
    ) {
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
      const response = await fetch(`/api/products/private/product/update/${url}`, {
        method: 'PUT',
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
        throw new Error(errorData.message || 'Error al actualizar el producto.');
      }

      toast.success(
        <div className="flex items-center">
          <span>Producto actualizado correctamente.</span>
        </div>,
        {
          theme: 'light',
          icon: true,
        }
      );
      // Avisar al Dashboard para refetchear la lista de productos si lo implementas
      onSuccess?.();
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar spinner mientras se carga el producto
  if (loadingType) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4 font-bold">Actualizar Producto</h2>
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
              {subcategories.map((subcategory, i) => (
                <option key={i} value={subcategory.subCategoryID}>
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
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Cargando...' : 'Actualizar Producto'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProductForm;
