// src/app/profile/admin/dashboard/hooks/useFetchData.js
import { useState, useEffect } from 'react';

const useFetchData = (endpoint, dataKey) => { // Añadimos 'dataKey' como parámetro
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al cargar los datos.');
      }
      const result = await res.json();
      if (result[dataKey] && Array.isArray(result[dataKey])) {
        setData(result[dataKey]);
      } else {
        throw new Error(`La clave '${dataKey}' no existe o no es un arreglo en la respuesta de la API.`);
      }
    } catch (err) {
      setError(err.message);
      setData([]); // Aseguramos que 'data' siempre sea un arreglo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, dataKey]);

  return { data, loading, error };
};

export default useFetchData;
