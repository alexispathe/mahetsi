'use client';
import { FaStopwatch } from 'react-icons/fa';

const Button = ({ children, to }) => (
  <a
    href={`#${to}`}
    className="text-left px-6 py-3 text-white hover:opacity-80 transition duration-300 border-b border-black"
  >
    {children}
  </a>
);

const SectionTitle = () => (
  <div className="flex items-center mb-8 lg:mb-0">
    <FaStopwatch className="text-white text-3xl mr-3" />
    <h2 className="text-2xl lg:text-3xl font-bold whitespace-nowrap">Productos Extra</h2>
  </div>
);

const RightSection = () => (
  <div className="mt-8 lg:mt-0 lg:ml-8 text-center lg:text-left">
    <p className="mb-4">Agrega ese complemento único</p>
    <button className="flex items-center border-b border-white hover:opacity-75 transition duration-300 mx-auto lg:mx-0">
      <span className="text-xl">→</span>
    </button>
  </div>
);

const ProductExtras = () => {
  const sectionStyle = {
    clipPath: 'polygon(0 10%, 100% 0%, 100% 90%, 0 100%)',
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Fondo Inclinado */}
      <div
        className="absolute inset-0 bg-[#1A1E29]"
        style={sectionStyle}
      ></div>

      {/* Contenido principal con padding proporcional */}
      <div className="relative max-w-7xl mx-auto px-[5%] py-[50px] text-white flex flex-col lg:flex-row justify-between items-center">
        {/* Sección Izquierda */}
        <SectionTitle />

        {/* Sección Central (lista de productos) */}
        <div className="flex flex-col bg-[#773C3C] border-b border-black space-y-4"> {/* Aplicamos space-y-4 aquí */}
          <Button to="jabónSaponificado">Jabón Saponificado</Button>
          <Button to="spa">SPA</Button>
          <Button to="velasAromaticas">Velas Aromáticas</Button>
          <Button to="mascotasBoho">Mascotas B&#39;oho</Button>

        </div>

        {/* Sección Derecha (Texto y flecha) */}
        <RightSection />
      </div>
    </section>
  );
};

export default ProductExtras;
