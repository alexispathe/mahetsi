'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import StarRating from '../product/StarRating';
export default function BestProducts() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Llama a la API para traer los productos con más ventas
  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products/public/get/best-sellers', {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error('Error al obtener productos más vendidos');
      }
      const data = await res.json();
      // data.bestSellers es el array de productos que el endpoint retorna
      setTopProducts(data.bestSellers || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la llamada a la API al montar el componente
  useEffect(() => {
    fetchBestSellers();
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección de productos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Producto destacado (el primer elemento de topProducts) */}
          <div className="flex flex-col items-center">
            {loading ? (
              // Skeleton para el producto principal
              <div className="w-full h-72 bg-gray-200 rounded-md animate-pulse mb-4" />
            ) : topProducts.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-6">Preferidos por los Clientes</h2>
                <Link
                  href={`/product/${topProducts[0].url}`}
                  className="flex flex-col items-center w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-300 p-4 rounded-md border-none hover:border-2 hover:border-gray-600"
                >
                  <Image
                    src={topProducts[0].images?.[0] || '/placeholder.png'}
                    alt={topProducts[0].name}
                    width={500}
                    height={400}
                    className="w-full h-72 object-cover rounded-md mb-4"
                  />
                  <div className="flex text-yellow-500">
                    <StarRating rating={topProducts[0].averageRating} />
                  </div>
                  <h3 className="text-lg font-semibold text-center">
                    {topProducts[0].name}
                  </h3>
                  <p className="text-xl font-bold">${topProducts[0].price}</p>
                </Link>
              </>
            ) : (
              <p>No hay productos disponibles.</p>
            )}
          </div>

          {/* Productos adicionales (los siguientes 4) */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {loading ? (
                // Skeleton para los productos adicionales
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-full h-48 bg-gray-200 rounded-md animate-pulse mb-4" />
                      <div className="w-3/4 h-4 bg-gray-200 rounded-md animate-pulse mb-2" />
                      <div className="w-1/2 h-4 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                  ))
              ) : (
                topProducts.slice(1).map((product) => (
                  <div key={product.uniqueID} className="flex flex-col items-center">
                    <Link
                      href={`/product/${product.url}`}
                      className="flex flex-col items-center w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-300 p-4 rounded-md border-none hover:border-2 hover:border-gray-600"
                    >
                      <Image
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={product.name}
                        width={500}
                        height={400}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <div className="flex text-yellow-500">
                        <StarRating rating={product.averageRating} />
                      </div>
                      <h3 className="text-lg font-semibold text-center">
                        {product.name}
                      </h3>
                      <p className="text-xl font-bold">${product.price}</p>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
