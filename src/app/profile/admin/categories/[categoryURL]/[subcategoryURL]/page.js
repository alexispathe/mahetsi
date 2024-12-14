// src/app/categories/[categoryURL]/[subcategoryURL]/page.js

"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';

const SubcategoryPage = () => {
  const params = useParams();
  const { categoryURL, subcategoryURL } = params;

  const [products, setProducts] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Obtener el ID de la subcategoría a partir del URL
        const categoriesResponse = await fetch('/api/categories/public/list');
        if (!categoriesResponse.ok) {
          throw new Error('Error al obtener las categorías.');
        }
        const categoriesData = await categoriesResponse.json();
        const category = categoriesData.categories.find(cat => cat.url === categoryURL);
        if (!category) {
          throw new Error('Categoría no encontrada.');
        }

        if (!category.subcategories) {
          throw new Error('No hay subcategorías para esta categoría.');
        }

        const subcategory = category.subcategories.find(sub => sub.url === subcategoryURL);
        if (!subcategory) {
          throw new Error('Subcategoría no encontrada.');
        }
        setSubcategoryName(subcategory.name);

        // Obtener los productos de la subcategoría
        const productsResponse = await fetch(`/api/products/public/list/subcategory/${subcategory.url}`);
        if (!productsResponse.ok) {
          if (productsResponse.status === 404) {
            setProducts([]);
          } else {
            throw new Error('Error al obtener los productos.');
          }
        } else {
          const productsData = await productsResponse.json();
          setProducts(productsData.products);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryURL, subcategoryURL]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{subcategoryName}</h1>
      {products.length === 0 ? (
        <p>No hay productos en esta subcategoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.url} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubcategoryPage;
