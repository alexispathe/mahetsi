import { useState, useEffect } from "react";

export default function Hero() {
  const [imageIndex, setImageIndex] = useState(0);
  const [fade, setFade] = useState(false); // Estado para controlar la transición de la imagen
  const images = [
    "https://mahetsipage.web.app/assets/images/instagram/ManzanaCanela0.jpeg",
    "https://mahetsipage.web.app/assets/images/instagram/Aguacate0.jpeg",
    "https://mahetsipage.web.app/assets/images/instagram/NaranjaAvenaAloe0.jpeg",
  ];

  // Cambiar imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Iniciar fade-out
      setTimeout(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Cambiar la imagen
        setFade(false); // Restaurar fade-in
      }, 500); // El tiempo del fade-out debe coincidir con la duración de la transición
    }, 3000); // Cambiar la imagen cada 3 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  return (
    <section className="relative w-full h-screen">
      {/* Imagen de fondo con transición suave */}
      <img
        src={images[imageIndex]}
        alt="Productos Naturales"
        className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${fade ? "opacity-0" : "opacity-100"}`}
        style={{
          transform: `translateY(${window.scrollY * 0.1}px)`, // Movimiento parallax
        }}
      />
      {/* Overlay oscuro encima de la imagen */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Contenido del Hero */}
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
