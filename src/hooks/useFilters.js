// hooks/useFilters.js
import { useState, useEffect } from 'react';

export const useFilters = () => {
  // Estados de filtros existentes
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Nuevo estado para subcategorías
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  // Manejar overflow del body al abrir/cerrar filtros
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedSubcategories([]);
    setMinPrice(0);
    setMaxPrice(1000);
  };

  return {
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    isFilterOpen,
    setIsFilterOpen,
    selectedCategories,
    setSelectedCategories,
    selectedBrands,
    setSelectedBrands,
    selectedTypes,
    setSelectedTypes,
    selectedSubcategories,
    setSelectedSubcategories,
    clearAllFilters,
  };
};
