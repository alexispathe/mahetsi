// hooks/useSubcategories.js
import { useState, useEffect } from 'react';

export const useSubcategories = (categoryId) => {
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(true);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      setIsLoadingSubcategories(false);
      return;
    }

    const fetchSubcategories = async () => {
      setIsLoadingSubcategories(true);
      try {
        const response = await fetch(`/api/categories/public/get/subcategories/${categoryId}`);
        if (!response.ok) throw new Error('Error al obtener las subcategorías');
        const data = await response.json();
        setSubcategories(data.subcategories);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setIsLoadingSubcategories(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  return { isLoadingSubcategories, subcategories };
};
