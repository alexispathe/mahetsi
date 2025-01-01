// src/hooks/useGetData.js
//Hook para devolver los datos para las secciones del administrador
"use client";
import { useState, useEffect } from "react";

export default function useGetData(url, key, shouldFetch = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(shouldFetch);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error(`Error obteniendo ${key}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [url, shouldFetch]);

  // Retornamos la función para volver a hacer la petición
  return { data, loading, error, refetch: fetchData };
}
