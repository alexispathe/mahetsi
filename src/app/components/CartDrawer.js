export default function CartDrawer({ isOpen, onClose }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
        <div className="bg-white w-1/3 p-6">
          <button onClick={onClose} className="absolute top-2 right-2">❌</button>
          <h2 className="text-2xl mb-4">Tu carrito</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Producto 1</span>
              <span>$250</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Producto 2</span>
              <span>$500</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-green-600 text-white py-2">Pagar</button>
        </div>
      </div>
    );
  }
  