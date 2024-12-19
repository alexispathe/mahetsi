// hooks/useProductsBySubcategory.js
import { useState, useEffect } from 'react';

export const useProducts = (category, subcategory) => { // Eliminamos el valor por defecto
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category || !subcategory) {
      setProducts([]);
      setIsLoadingProducts(false);
      return;
    }

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch(`/api/products/public/get/getFilteredProducts/${category.uniqueID}/${subcategory}`);
        if (!response.ok) throw new Error('Error al obtener los productos filtrados por subcategoría');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  return { isLoadingProducts, products };
};
