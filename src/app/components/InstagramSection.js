'use client';
import { FaInstagram, FaWhatsapp, FaTruck, FaSyncAlt } from 'react-icons/fa'; // Importando los iconos necesarios
import { useState, useEffect } from 'react'; // Para manejar el estado del modal de imagen
import Image from 'next/image'; // Importar la etiqueta Image de Next.js

export default function InstagramSection() {
  const [isZoomed, setIsZoomed] = useState(false); // Controla la visibilidad del modal
  const [currentImage, setCurrentImage] = useState(''); // Almacena la URL de la imagen seleccionada
  const [loading, setLoading] = useState(true); // Estado de carga para simular la carga de imágenes

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

  // Simulación de carga (puedes cambiar el tiempo según sea necesario)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Cambiar el estado a false después de 1.5 segundos (simulando carga)
    }, 1500);

    return () => clearTimeout(timer); // Limpiar el temporizador
  }, []);

  return (
    <section className="w-full bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Estructura flex para la imagen grande y las pequeñas */}
        <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-between mb-12">
          {/* Lado izquierdo con la imagen grande */}
          <div className="lg:w-2/5 w-full mb-6 lg:mb-0">
            {loading ? (
              // Skeleton para la imagen grande
              <div className="w-full h-80 bg-gray-200 rounded-xl animate-pulse"></div>
            ) : (
              <Image
                src="https://mahetsipage.web.app/assets/images/products/img-5.jpeg"
                alt="Producto destacado"
                className="w-full h-80 object-cover rounded-xl cursor-pointer transition-transform duration-300 transform hover:scale-105"
                width={640} // Especificar el ancho
                height={320} // Especificar el alto
                onClick={() => handleZoom('https://mahetsipage.web.app/assets/images/products/img-5.jpeg')} // Abre el modal al hacer click
              />
            )}
          </div>

          {/* Lado derecho con las imágenes pequeñas */}
          <div className="lg:w-3/5 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[ 
              'https://mahetsipage.web.app/assets/images/products/img-6.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-1.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-2.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-3.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-4.jpeg',
              'https://mahetsipage.web.app/assets/images/products/img-1.jpeg',
            ].map((imgSrc, index) => (
              <div key={index} className="p-1 cursor-pointer">
                {loading ? (
                  // Skeleton para las imágenes pequeñas
                  <div className="w-full h-40 bg-gray-200 rounded-xl animate-pulse"></div>
                ) : (
                  <Image
                    src={imgSrc}
                    alt={`Producto ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl transition-transform duration-300 transform hover:scale-105"
                    width={640} // Especificar el ancho
                    height={320} // Especificar el alto
                    onClick={() => handleZoom(imgSrc)} // Abre el modal al hacer click
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enlace a Instagram */}
        <div className="flex justify-center items-center mb-12">
          <FaInstagram className="text-5xl text-white" />
          <a
            href="https://www.instagram.com/mahetsi"
            className="text-white text-lg ml-3 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Síguenos en Instagram @mahetsi
          </a>
        </div>
      </div>

      {/* Sección de Información adicional */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-6">
          <div className="flex items-center bg-white p-4 rounded-lg shadow-md min-w-[200px]">
            <FaWhatsapp className="text-green-500 text-3xl mr-4" />
            <span className="text-gray-800 font-semibold">Servicio al cliente</span>
          </div>

          <div className="flex items-center bg-white p-4 rounded-lg shadow-md min-w-[200px]">
            <FaTruck className="text-blue-500 text-3xl mr-4" />
            <span className="text-gray-800 font-semibold">Entrega Nacional Gratis!!</span>
          </div>

          <div className="flex items-center bg-white p-4 rounded-lg shadow-md min-w-[200px]">
            <FaSyncAlt className="text-yellow-500 text-3xl mr-4" />
            <span className="text-gray-800 font-semibold">Devoluciones</span>
          </div>
        </div>
      </div>

      {/* Modal para la imagen ampliada */}
      {isZoomed && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeZoom} // Cierra el modal al hacer click en el fondo
        >
          <div className="relative flex justify-center">
            <Image
              src={currentImage}
              alt="Imagen ampliada"
              className="w-11/12 max-w-3xl rounded-xl shadow-lg"
              width={640} // Especificar el ancho
              height={320} // Especificar el alto
              onClick={(e) => e.stopPropagation()} // Evita que el click en la imagen cierre el modal
            />
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-pink-500 transition-colors duration-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
