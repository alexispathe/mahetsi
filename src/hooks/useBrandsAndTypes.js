// hooks/useBrandsAndTypes.js
import { useState, useEffect } from 'react';

export const useBrandsAndTypes = (category) => {
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (category) {
      const { uniqueID } = category;

      const fetchBrands = async () => {
        setIsLoadingBrands(true);
        try {
          const response = await fetch(`/api/brands/public/get/getBrandsByCategory?categoryID=${uniqueID}`);
          if (!response.ok) throw new Error('Error al obtener las marcas');
          const data = await response.json();
          setBrands(data.brands);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingBrands(false);
        }
      };

      const fetchTypes = async () => {
        setIsLoadingTypes(true);
        try {
          const response = await fetch(`/api/types/public/get/getTypesByCategory?categoryID=${uniqueID}`);
          if (!response.ok) throw new Error('Error al obtener los tipos');
          const data = await response.json();
          setTypes(data.types);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingTypes(false);
        }
      };

      fetchBrands();
      fetchTypes();
    }
  }, [category]);

  return { isLoadingBrands, isLoadingTypes, brands, types };
};
