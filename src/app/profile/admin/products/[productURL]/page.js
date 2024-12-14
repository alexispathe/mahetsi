// src/app/products/[productURL]/page.js

"use client";

import ProductDetail from '../../components/ProductDetail';

const ProductPage = () => {
  return (
    <div>
      <ProductDetail />
      {/* Puedes agregar más componentes relacionados, como productos recomendados */}
    </div>
  );
};

export default ProductPage;
