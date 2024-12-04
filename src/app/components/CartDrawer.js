import { useEffect } from "react";
import '../styles/cartDrawer.css';

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
      name: "Mens StormBreaker Jacket",
      size: "Medium",
      qty: 1,
      price: 85.00,
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg" // Reemplaza con la ruta correcta
    },
    {
      name: "Mens Torrent Terrain Jacket",
      size: "Medium",
      qty: 1,
      price: 99.00,
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg" // Reemplaza con la ruta correcta
    },
  ];

  const subtotal = products.reduce((total, product) => total + product.price, 0);
  const shippingThreshold = 255; // Ajuste para el umbral de envío gratis
  const shippingProgress = (subtotal >= shippingThreshold ? 100 : (subtotal / shippingThreshold) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      {/* Overlay que cubre toda la pantalla */}
      <div className="cart-drawer bg-white w-1/3 p-6 overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          ❌
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {/* Shipping Progress */}
        <div className="mb-4">
          <div className="flex justify-between">
            <span className="text-sm">$22 away from free delivery</span>
            <span className="text-sm">${subtotal < shippingThreshold ? shippingThreshold - subtotal : 0} for free shipping</span>
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
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">Size: {product.size}</p>
                  <p className="text-sm text-gray-600">Qty: {product.qty}</p>
                </div>
              </div>
              <span className="font-semibold text-lg">${product.price}</span>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="flex justify-between mt-4 font-semibold text-lg">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-4">
          <a href="/checkout"><button className="w-full bg-orange-600 text-white py-3 rounded-lg">Checkout</button></a>
          <a href="/cart"><button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg">View Cart</button></a>
        </div>
      </div>
    </div>
  );
}
