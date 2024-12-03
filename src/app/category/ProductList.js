'use client'

import React from "react";

// Componente para mostrar los productos
function ProductList() {
  const products = [
    {
      image: 'https://mahetsipage.web.app/assets/images/products/img-5.jpeg',
      name: 'Full Zip Hoodie',
      price: 1129.99,
      discount: 25, // 25% off
      originalPrice: 1500.00,
      rating: 4.7,
      reviews: 456
    },
    {
      image: 'https://mahetsipage.web.app/assets/images/products/img-6.jpeg',
      name: 'Mens Sherpa Hoodie',
      price: 599.55,
      discount: 65, // 65% off
      originalPrice: 150.00,
      rating: 4.4,
      reviews: 1289
    },
    {
      image: 'https://mahetsipage.web.app/assets/images/products/img-1.jpeg',
      name: 'Womens Essentials Hoodie',
      price: 779.55,
      discount: 50, // 50% off
      originalPrice: 1100.00,
      rating: 4.7,
      reviews: 754
    },
  ];

  return (
    <section className="product-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <div key={index} className="product-item bg-white p-4 rounded-lg shadow-md">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4" />
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <div className="flex items-center space-x-2">
            <p className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</p>
            {product.discount > 0 && (
              <p className="text-sm text-red-500">-{product.discount}%</p>
            )}
          </div>
          <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-yellow-400 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
        </div>
      ))}
    </section>
  );
}

export default ProductList;
