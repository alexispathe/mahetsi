'use client';
import { FaStopwatch } from 'react-icons/fa'; // Importamos el icono para "Productos Extra"
import '../styles/productExtras.css';

export default function ProductExtras() {
  return (
    <section className="w-full bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center">
        {/* Sección Izquierda */}
        <div className="flex items-center mb-8 lg:mb-0">
          <FaStopwatch className="text-white text-3xl mr-3" />
          <h2 className="text-2xl lg:text-3xl font-bold text-white">Sale Extended</h2>
        </div>

        {/* Sección Central (botones de productos) */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 lg:mb-0">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition duration-300">
            Shop Menswear
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition duration-300">
            Shop Womenswear
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition duration-300">
            Shop Kidswear
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition duration-300">
            Shop Accessories
          </button>
        </div>

        {/* Sección Derecha (Texto y botón de acción) */}
        <div className="text-center lg:text-right">
          <p className="text-white text-lg mb-4">Discount applied to products at checkout.</p>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition duration-300">
            Exclusions apply. Learn more →
          </button>
        </div>
      </div>
    </section>
  );
}
