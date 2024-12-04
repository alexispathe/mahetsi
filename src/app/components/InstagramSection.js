'use client';
import { FaInstagram, FaWhatsapp, FaTruck, FaSyncAlt } from 'react-icons/fa'; // Importando los iconos necesarios
import { useState } from 'react'; // Para manejar el estado del modal de imagen
import '../styles/instagramSection.css'

export default function InstagramSection() {
  const [isZoomed, setIsZoomed] = useState(false); // Controla la visibilidad del modal
  const [currentImage, setCurrentImage] = useState(''); // Almacena la URL de la imagen seleccionada

  // Función para abrir el modal con la imagen seleccionada
  const handleZoom = (imageUrl) => {
    setIsZoomed(true);
    setCurrentImage(imageUrl);
  };

  // Función para cerrar el modal
  const closeZoom = () => {
    setIsZoomed(false);
    setCurrentImage('');
  };

  return (
    <section className="instagram-section">
      <div className="container mx-auto">
        {/* Estructura flex para la imagen grande y las pequeñas */}
        <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-between mb-8">
          {/* Lado izquierdo con la imagen grande */}
          <div className="lg:w-2/5 mb-4">
            <img
              src="https://mahetsipage.web.app/assets/images/products/img-5.jpeg"
              alt="Producto destacado"
              className="main-image"
              onClick={() => handleZoom('https://mahetsipage.web.app/assets/images/products/img-5.jpeg')} // Abre el modal al hacer click
            />
          </div>

          {/* Lado derecho con las imágenes pequeñas */}
          <div className="lg:w-3/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Repite este bloque para cada imagen pequeña */}
            {[
              'https://mahetsipage.web.app/assets/images/products/img-6.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-1.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-2.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-3.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-4.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-1.jpeg',
            ].map((imgSrc, index) => (
              <div key={index} className="p-1 cursor-pointer">
                <img
                  src={imgSrc}
                  alt={`Producto ${index + 1}`}
                  className="small-image"
                  onClick={() => handleZoom(imgSrc)} // Abre el modal al hacer click
                />
              </div>
            ))}
          </div>
        </div>

        {/* Enlace a Instagram */}
        <div className="flex justify-center items-center mb-6 mt-8">
          <FaInstagram className="text-4xl text-white" />
          <a
            href="https://www.instagram.com/mahetsi"
            className="text-white text-lg ml-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Síguenos en Instagram @mahetsi
          </a>
        </div>
      </div>

      {/* Sección de Información adicional */}
      <div className="info-section">
        <div className="info-container">
          <div className="info-box">
            <FaWhatsapp className="info-icon whatsapp-icon" />
            <span className="info-text">Servicio al cliente</span>
          </div>

          <div className="info-box">
            <FaTruck className="info-icon truck-icon" />
            <span className="info-text">Entrega Nacional Gratis!!</span>
          </div>

          <div className="info-box">
            <FaSyncAlt className="info-icon sync-icon" />
            <span className="info-text">Devoluciones</span>
          </div>
        </div>
      </div>

      {/* Modal para la imagen ampliada */}
      {isZoomed && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeZoom} // Cierra el modal al hacer click en el fondo
        >
          <div className="relative">
            <img
              src={currentImage}
              alt="Imagen ampliada"
              className="zoomed-image"
            />
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 text-white text-3xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
