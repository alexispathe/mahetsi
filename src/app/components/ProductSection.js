'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { products, orders } from '../category/data'; // Asegúrate de importar los datos correctamente

export default function ProductSection() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // Calcular las ventas totales de cada producto
    const productSales = products.map((product) => {
      const totalSales = orders.reduce((acc, order) => {
        const productInOrder = order.orderItems.find(item => item.productID === product.uniqueID);
        if (productInOrder) {
          return acc + productInOrder.quantity; // Sumar las cantidades compradas
        }
        return acc;
      }, 0);

      return {
        ...product,
        totalSales
      };
    });

    // Ordenar los productos por las ventas totales, de mayor a menor
    const sortedProducts = productSales.sort((a, b) => b.totalSales - a.totalSales);

    // Obtener solo los 5 productos con más ventas
    setTopProducts(sortedProducts.slice(0, 5));
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <h2 className="text-3xl font-bold mb-6 text-center">Preferidos por los Clientes</h2>

        {/* Sección de productos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Producto destacado */}
          <div className="flex flex-col items-center">
            {topProducts.length > 0 && (
              <Link
                href={`/product/${topProducts[0].url}`} // Enlace al producto principal
                className="flex flex-col items-center w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-300 p-4 rounded-md border-none hover:border-2 hover:border-gray-600"
              >
                <img
                  src={topProducts[0].images[0]} // Usar la primera imagen del producto
                  alt={topProducts[0].name}
                  className="w-full h-72 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold text-center">{topProducts[0].name}</h3>
                <p className="text-xl font-bold text-red-600">${topProducts[0].price}</p>
              </Link>
            )}
          </div>

          {/* Productos adicionales */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {topProducts.slice(1).map((product, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Link
                    href={`/product/${product.url}`} // Enlace al producto
                    className="flex flex-col items-center w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-300 p-4 rounded-md border-none hover:border-2 hover:border-gray-600"
                  >
                    <img
                      src={product.images[0]} // Usar la primera imagen del producto
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold text-center">{product.name}</h3>
                    <p className="text-xl font-bold text-red-600">${product.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
