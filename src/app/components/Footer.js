'use client'
import { FaEnvelope } from "react-icons/fa"; // Icono para el correo electrónico

export default function Footer() {
  return (
    <footer className="bg-[#1c1f28] text-white py-10">
         <div className="border-t border-[gray] mt-8 pt-6 text-center">
        </div>
      <div className="container mx-auto px-6">
        {/* Estructura del footer con 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Productos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Productos</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Velas Aromáticas</a></li>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Jabones</a></li>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Línea mascotas B'oho</a></li>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">SPA</a></li>
            </ul>
          </div>

          {/* Columna 2: Mahets'i & Boho */}
          <div>
            <h3 className="text-lg font-bold mb-4">Mahets'i & Boho</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Sobre nosotros</a></li>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Donde encontrarnos</a></li>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Contacto</a></li>
            </ul>
          </div>

          {/* Columna 3: Ayuda */}
          <div>
            <h3 className="text-lg font-bold mb-4">Ayuda</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Mayoreo</a></li>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Política de Privacidad</a></li>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Términos y Condiciones</a></li>
              <li className="mb-2"><a href="#" className="hover:text-[gold]">Devoluciones y Reembolsos</a></li>
            </ul>
          </div>

          {/* Columna 4: Suscripción y pagos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Suscríbete!</h3>
            <p className="mb-4">Recibe promociones y beneficios exclusivos, así como noticias sobre los nuevos lanzamientos.</p>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Escribe tu Email"
                className="p-3 w-full text-black rounded-l-md"
              />
              <button className="bg-[#F44336] text-white p-3 rounded-r-md">
                <FaEnvelope />
              </button>
            </div>

            {/* Métodos de pago */}
            <div className="flex justify-start gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/PayPal_logo_2014.png" alt="PayPal" className="w-12" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Visa_Inc._logo_2014.png" alt="Visa" className="w-12" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/MasterCard_logo.svg" alt="MasterCard" className="w-12" />
            </div>
          </div>
        </div>

        {/* Línea de separación */}
        <div className="border-t border-[gray] mt-8 pt-6 text-center">
          <p>© 2023 Mahetsi Todos los derechos reservados. Propiedad de Mahetsi</p>
        </div>
      </div>
    </footer>
  );
}
