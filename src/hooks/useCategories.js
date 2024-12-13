// hooks/useCategories.js
import { useState, useEffect } from 'react';

export const useCategories = () => {
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetch('/api/categories/public/get/getAllCategories');
        if (!response.ok) throw new Error('Error al obtener las categorías');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  return { isLoadingCategories, categories };
};
