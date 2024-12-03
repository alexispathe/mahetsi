import { useEffect } from "react";

export default function CartDrawer({ isOpen, onClose }) {
  // Cerrar el carrito cuando se hace clic fuera de él
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (event.target.closest(".cart-drawer") === null) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      // Limpiar el evento al cerrar el carrito
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const products = [
    {
      name: "Jabón Artesanal Agua de Mar",
      aroma: "Calido",
      type: "Hidratante",
      price: 250,
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg" // Cambia la ruta de la imagen según tus recursos
    },
    {
      name: "Jabón Artesanal Aguacate",
      aroma: "Fresco",
      type: "Hidratante",
      price: 250,
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg" // Cambia la ruta de la imagen según tus recursos
    },
  ];

  const subtotal = products.reduce((total, product) => total + product.price, 0);
  const shippingThreshold = 200;
  const shippingProgress = (subtotal >= shippingThreshold ? 100 : (subtotal / shippingThreshold) * 100);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      {/* Overlay que cubre toda la pantalla */}
      <div className="cart-drawer bg-white w-1/3 p-6 overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          ❌
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>

        {/* Shipping Progress */}
        <div className="mb-4">
          <div className="flex justify-between">
            <span>¡$200 Para Envio gratis!</span>
            <span>${subtotal < shippingThreshold ? shippingThreshold - subtotal : 0} para envío gratis</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${shippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">Aroma: {product.aroma}</p>
                  <p className="text-sm text-gray-600">{product.type}</p>
                </div>
              </div>
              <span className="font-semibold">${product.price}</span>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="flex justify-between mt-4 font-semibold">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button className="w-full bg-green-600 text-white py-2 rounded-lg"><a href="/summary">Pagar</a></button>
          <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg"><a href="/cart">Ver carrito</a></button>
        </div>
      </div>
    </div>
  );
}
