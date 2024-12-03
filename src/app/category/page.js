'use client'

import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import PriceFilter from './PriceFilter';
import BrandFilter from './BrandFilter';
import ProductList from './ProductList';

export default function ProductPage() {
  const [minPrice, setMinPrice] = useState(60);
  const [maxPrice, setMaxPrice] = useState(900);

  const products = [
    { image: 'https://mahetsipage.web.app/assets/images/products/img-5.jpeg', name: 'Full Zip Hoodie', price: 1129.99 },
    { image: 'https://mahetsipage.web.app/assets/images/products/img-6.jpeg', name: 'Mens Sherpa Hoodie', price: 599.55 },
    { image: 'https://mahetsipage.web.app/assets/images/products/img-1.jpeg', name: 'Womens Essentials Hoodie', price: 779.55 }
  ];

  const filteredProducts = products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );

  return (
    <div className="product-page flex gap-8">
      <div className="filter-section w-1/4">
        <CategoryFilter />
        <PriceFilter onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }} />
        <BrandFilter />
      </div>
      <div className="product-section w-3/4">
        <ProductList products={filteredProducts} />
      </div>
    </div>
  );
}
