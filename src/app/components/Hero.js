import { useState, useEffect } from "react";
import '../styles/hero.css'

export default function Hero() {
  const [imageIndex, setImageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [scrollY, setScrollY] = useState(0); // Estado para almacenar la posición del scroll

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
      <img
        src={images[imageIndex]}
        alt="Productos Naturales"
        className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          fade ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10">
        <h1 className="text-5xl font-bold">Mahets'i Productos Naturales</h1>
        <div className="mt-4 flex space-x-4">
          <button className="bg-red-600 px-4 py-2 rounded">Productos</button>
          <button className="bg-gray-600 px-4 py-2 rounded">Conócenos</button>
        </div>
      </div>
    </section>
  );
}
