import { useEffect } from "react";

export default function SearchModal({ isOpen, onClose }) {
  // Cerrar el modal si el usuario hace clic fuera de él
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (event.target.closest(".search-modal") === null) {
          onClose();  // Cerrar el modal
        }
      };

      // Agregar el evento de clic
      document.addEventListener("mousedown", handleClickOutside);

      // Limpiar el evento cuando se cierra el modal
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Datos de ejemplo de los productos
  const products = [
    { name: "Mens Pennie II Waterproof Jacket", price: 325.66, image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg" },
    { name: "Mens Storm Waterproof Jacket", price: 499.99, image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg" }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="search-modal bg-white w-full max-w-3xl p-6 rounded-lg shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg text-gray-600 hover:text-gray-900"
        >
          ❌
        </button>
        
        <h2 className="text-xl font-semibold mb-4">¿Qué estás buscando?</h2>
        
        <input
          type="text"
          placeholder="Search by product or category name..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        
        <div className="text-sm mb-4">
          <span>2 resultados para "jabón lavanda"</span>
        </div>

        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>¿No encontraste lo que buscabas? <a href="#" className="text-blue-600">Envíanos un mensaje.</a></p>
        </div>
      </div>
    </div>
  );
}
