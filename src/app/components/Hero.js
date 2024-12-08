import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  const [imageIndex, setImageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const images = [
    "https://mahetsipage.web.app/assets/images/instagram/ManzanaCanela0.jpeg",
    "https://mahetsipage.web.app/assets/images/instagram/Aguacate0.jpeg",
    "https://mahetsipage.web.app/assets/images/instagram/NaranjaAvenaAloe0.jpeg",
  ];

  // Cambiar imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Actualizar scrollY al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Imagen de Fondo */}
      <img
        src={images[imageIndex]}
        alt="Productos Naturales"
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          fade ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Mahets&#39;i Productos Naturales
        </h1>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="bg-red-600 hover:bg-red-700 transition-colors duration-300 px-6 py-3 rounded text-lg flex items-center">
            Productos <FaArrowRight className="ml-2" />
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 transition-colors duration-300 px-6 py-3 rounded text-lg">
            Conócenos
          </button>
        </div>
      </div>
    </section>
  );
}
