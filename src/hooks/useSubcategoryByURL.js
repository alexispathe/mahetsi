// hooks/useSubcategoryByURL.js

import { useState, useEffect } from 'react';

export const useSubcategoryByURL = (categoryId, subcategoryURL) => {
  const [isLoadingSubcategory, setIsLoadingSubcategory] = useState(true);
  const [subcategory, setSubcategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId || !subcategoryURL) {
      setSubcategory(null);
      setIsLoadingSubcategory(false);
      return;
    }

    const fetchSubcategory = async () => {
      setIsLoadingSubcategory(true);
      try {
        const response = await fetch(`/api/categories/public/get/subcategoryByURL/${categoryId}/${subcategoryURL}`);
        if (!response.ok) {
          throw new Error('Error al obtener la subcategoría');
        }
        const data = await response.json();
        setSubcategory(data.subcategory);
      } catch (err) {
        console.error('Error fetching subcategory by URL:', err);
        setError(err);
      } finally {
        setIsLoadingSubcategory(false);
      }
    };

    fetchSubcategory();
  }, [categoryId, subcategoryURL]);

  return { isLoadingSubcategory, subcategory, error };
};
