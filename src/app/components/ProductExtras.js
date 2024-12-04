'use client'
import { FaStopwatch } from "react-icons/fa"; // Importamos el icono para "Productos Extra"
import '../styles/productExtras.css'
export default function ProductExtras() {
  return (
    <section className="product-extras-container">
      <div className="content-container">
        {/* Sección Izquierda */}
        <div className="left-section">
        <div className="title-container">
            <FaStopwatch className="icon" />
            <h2 className="title">Productos Extra</h2>
          </div>
        </div>

        {/* Sección Central (botones de productos) */}
        <div className="center-section">
          <h2>Productos Extra</h2>
          <div className="buttons-container">
            <button className="product-button">Jabón Saponificado</button>
            <button className="product-button">SPA</button>
            <button className="product-button">Velas Aromáticas</button>
            <button className="product-button">Mascotas B'aho</button>
          </div>
        </div>

        {/* Sección Derecha (Título y botón de acción) */}
        <div className="right-section">
         
          <button className="cta-button">Agrega ese complemento único</button>
        </div>
      </div>
    </section>
  );
}
