'use client'
import { FaInstagram } from 'react-icons/fa'; // Usando React Icons para Instagram
import { FaWhatsapp, FaTruck, FaSyncAlt } from 'react-icons/fa'; // Para los otros íconos
import { useState } from 'react'; // Para manejar el estado de la imagen grande

export default function InstagramSection() {
  const [isZoomed, setIsZoomed] = useState(false); // Controlar el zoom de la imagen
  const [currentImage, setCurrentImage] = useState(""); // Para almacenar la imagen seleccionada

  const handleZoom = (imageUrl) => {
    setIsZoomed(true);
    setCurrentImage(imageUrl);
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setCurrentImage("");
  };

  return (
    <section className="instagram-section bg-[#1c1f28] py-10">
      <div className=" mx-auto px-6" style={{width: "80%"}}>
        {/* Estructura flex para que la imagen grande esté a la izquierda y las otras imágenes a la derecha */}
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Lado izquierdo con la imagen grande */}
          <div className="lg:w-2/5 mb-6 lg:mb-0 relative">
            <img
              src="https://mahetsipage.web.app/assets/images/products/img-5.jpeg"
              alt="Producto destacado"
              className="w-full h-72 object-cover rounded-md cursor-pointer"
              onClick={() => handleZoom("https://mahetsipage.web.app/assets/images/products/img-5.jpeg")} // Imagen grande al hacer click
            />
            {/* Lupa al pasar el mouse sobre la imagen */}
          </div>

          {/* Lado derecho con las imágenes en 4 columnas y 2 filas */}
          <div className="lg:w-3/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className=" p-1 cursor-pointer">
              <img
                src="https://mahetsipage.web.app/assets/images/products/img-6.jpeg"
                alt="Producto 1"
                className="w-full h-48 object-cover rounded-md"
                onClick={() => handleZoom("https://mahetsipage.web.app/assets/images/products/img-6.jpeg")}
              />
            </div>
            <div className=" p-1 cursor-pointer">
              <img
                src="https://mahetsipage.web.app/assets/images/products/img-1.jpeg"
                alt="Producto 2"
                className="w-full h-48 object-cover rounded-md"
                onClick={() => handleZoom("https://mahetsipage.web.app/assets/images/products/img-1.jpeg")}
              />
            </div>
            <div className=" p-1 cursor-pointer">
              <img
                src="https://mahetsipage.web.app/assets/images/products/img-2.jpeg"
                alt="Producto 3"
                className="w-full h-48 object-cover rounded-md"
                onClick={() => handleZoom("https://mahetsipage.web.app/assets/images/products/img-2.jpeg")}
              />
            </div>
            <div className=" p-1 cursor-pointer">
              <img
                src="https://mahetsipage.web.app/assets/images/products/img-3.jpeg"
                alt="Producto 4"
                className="w-full h-48 object-cover rounded-md"
                onClick={() => handleZoom("https://mahetsipage.web.app/assets/images/products/img-3.jpeg")}
              />
            </div>
            <div className=" p-1 cursor-pointer">
              <img
                src="https://mahetsipage.web.app/assets/images/products/img-4.jpeg"
                alt="Producto 5"
                className="w-full h-48 object-cover rounded-md"
                onClick={() => handleZoom("https://mahetsipage.web.app/assets/images/products/img-4.jpeg")}
              />
            </div>
            <div className=" p-1 cursor-pointer">
              <img
                src="https://mahetsipage.web.app/assets/images/products/img-1.jpeg"
                alt="Producto 6"
                className="w-full h-48 object-cover rounded-md"
                onClick={() => handleZoom("https://mahetsipage.web.app/assets/images/products/img-1.jpeg")}
              />
            </div>
          </div>
        </div>

        {/* Enlace a Instagram */}
        <div className="flex justify-center items-center mb-6 mt-8">
          <FaInstagram className="text-4xl text-white" />
          <a
            href="https://www.instagram.com/mahetsi"
            className="text-white text-lg ml-2"
          >
            Síguenos en Instagram @mahetsi
          </a>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
            <FaWhatsapp className="text-2xl text-[#25D366]" />
            <span className="ml-2 text-lg">Servicio al cliente</span>
          </div>
          <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
            <FaTruck className="text-2xl text-[#1E40AF]" />
            <span className="ml-2 text-lg">Entrega Nacional Gratis!!</span>
          </div>
          <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
            <FaSyncAlt className="text-2xl text-[#D97706]" />
            <span className="ml-2 text-lg">Devoluciones</span>
          </div>
        </div>
      </div>

      {/* Modal para la imagen ampliada */}
      {isZoomed && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeZoom}>
          <div className="relative">
            <img
              src={currentImage}
              alt="Imagen ampliada"
              className="w-full h-auto max-w-4xl object-contain rounded-md transition-all duration-500 ease-in-out"
            />
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
