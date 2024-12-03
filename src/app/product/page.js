'use client';
import '../styles/product.css';
import React, { useState } from "react";
import Header from '../components/Header';

export default function ProductDetail() {
  const [mainImage, setMainImage] = useState(
    "https://mahetsipage.web.app/assets/images/products/img-5.jpeg"
  );

  const thumbnails = [
    "https://mahetsipage.web.app/assets/images/products/img-1.jpeg",
    "https://mahetsipage.web.app/assets/images/products/img-2.jpeg",
    "https://mahetsipage.web.app/assets/images/products/img-3.jpeg",
    "https://mahetsipage.web.app/assets/images/products/img-4.jpeg",
  ];

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <>
     <div className="product-detail-container">
      <div className="product-detail">
        {/* Imagenes del lado izquierdo */}
        <div className="product-images">
          <div className="image-thumbnails">
            {thumbnails.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail"
                onClick={() => handleThumbnailClick(image)}
              />
            ))}
          </div>
          <img
            className="main-image"
            src={mainImage}
            alt="Producto principal"
          />
        </div>

        {/* Información del producto */}
        <div className="product-info">
          <p className="breadcrumb">HOME / ACTIVITIES / NATURAL PRODUCTS</p>
          <h1 className="product-title">Aloe Vera Handmade Soap</h1>
          <div className="rating-and-views">
            <div className="stars">⭐⭐⭐⭐☆</div>
            <p>(1288 Reviews)</p>
          </div>
          <div className="price-section">
            <p className="current-price">$15.99</p>
            <p className="original-price">$20.00</p>
            <p className="discount">Save $4.01</p>
          </div>
          <div className="product-options">
            <p>COLOUR: GREEN</p>
            <div className="color-options">
              <div className="color-swatch green"></div>
              <div className="color-swatch blue"></div>
              <div className="color-swatch red"></div>
            </div>
            <label htmlFor="size-select">SIZE:</label>
            <select id="size-select" className="size-select">
              <option>Please Select Size</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
          <div className="action-buttons">
            <button className="add-to-cart">Add To Cart</button>
            <button className="wishlist">❤</button>
          </div>
          <div className="delivery-info">
            <p>📦 Free delivery over $99. Next day delivery $9.99</p>
          </div>
        </div>
      </div>
    </div>
      <Header/>
    </>
   
  );
}
