'use client';
import { FaStopwatch } from 'react-icons/fa'; // Importamos el icono para "Productos Extra"
import '../styles/productExtras.css';

export default function ProductExtras() {
  return (
    <section className="product-extras-container">
      <div className="content-container">
        {/* Sección Izquierda */}
        <div className="left-section">
          <div className="title-container">
            <FaStopwatch className="icon" />
            <h2 className="title">Sale Extended</h2>
          </div>
        </div>

        {/* Sección Central (botones de productos) */}
        <div className="center-section">
          <div className="buttons-container">
            <button className="product-button">Shop Menswear</button>
            <button className="product-button">Shop Womenswear</button>
            <button className="product-button">Shop Kidswear</button>
            <button className="product-button">Shop Accessories</button>
          </div>
        </div>

        {/* Sección Derecha (Texto y botón de acción) */}
        <div className="right-section">
          <p className="discount-text">Discount applied to products at checkout.</p>
          <button className="cta-button">Exclusions apply. Learn more →</button>
        </div>
      </div>
    </section>
  );
}
