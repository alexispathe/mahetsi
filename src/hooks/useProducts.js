// hooks/useProducts.js
import { useState, useEffect } from 'react';

export const useProducts = (category) => {
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch('/api/products/public/get/getFilteredProducts/'+ category.uniqueID);
        if (!response.ok) throw new Error('Error al obtener todos los productos');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (category) {
      fetchAllProducts();
    }
  }, [category]);

  return { isLoadingProducts, products };
};
