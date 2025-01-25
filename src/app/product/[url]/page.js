// src/app/product/[url]/page.js

'use client';

import React from "react";
import { useParams } from "next/navigation";
import ProductDetail from "./ProductDetail";

export default function ProductPage() {
  const params = useParams();
  const productUrl = params.url; // obtenemos el 'url' de los parámetros de ruta

  return (
    <>
      
      {/* ProductDetail recibe la prop productUrl */}
      <ProductDetail productUrl={productUrl} />
    </>
  );
}
