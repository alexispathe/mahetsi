'use client'

import { FaPaypal } from 'react-icons/fa'; // Usando el ícono de Paypal

// Componente para mostrar los productos en el carrito
function CartItems() {
  const items = [
    {
      image: 'https://mahetsipage.web.app/assets/images/products/img-5.jpeg',
      name: 'Mens StormBreaker Jacket',
      details: 'Mens / Blue / Medium',
      price: 1129.99,
      quantity: 1
    },
    {
      image: 'https://mahetsipage.web.app/assets/images/products/img-6.jpeg',
      name: 'North Face Jacket',
      details: 'Mens / Blue / Large',
      price: 499.99,
      quantity: 2
    },
    {
      image: 'https://mahetsipage.web.app/assets/images/products/img-1.jpeg',
      name: 'Womens Adidas Hoodie',
      details: 'Womens / Red / Medium',
      price: 59.99,
      quantity: 1
    }
  ];

  return (
    <section className="cart-items py-8 px-6 bg-white shadow-lg rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      <div className="">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.details}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-semibold">${item.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{item.quantity} @ ${item.price.toFixed(2)}</p>
              <button className="text-gray-500 hover:text-red-500">✕</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Componente para mostrar el resumen de la orden
function OrderSummary() {
  const subtotal = 422.99;
  const shipping = 0.00;
  const grandTotal = subtotal + shipping + 45.89; // Incluyendo impuestos

  return (
    <section className="order-summary bg-[#1c1f28]  text-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
      <div className="mb-4">
        <p>Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
        <p>Shipping: <span className="font-semibold">Will be set at checkout</span></p>
        <p>Grand Total: <span className="font-semibold">${grandTotal.toFixed(2)}</span> <span className="text-xs">(Inc $45.89 sales tax)</span></p>
      </div>
      <div className="mb-4">
        <label className="text-sm">Have a coupon code?</label>
        <input type="text" className="w-full p-2 mt-2 text-black rounded-md" placeholder="Enter coupon code" />
      </div>
      <div className="mt-4">
        <button className="w-full bg-white text-[#1c1f28] py-2 px-4 rounded-md mb-4 hover:bg-gray-200">
          Proceed to checkout
        </button>
        <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600">
          <FaPaypal className="inline-block mr-2 text-xl" /> Checkout with PayPal
        </button>
      </div>
    </section>
  );
}

// Componente principal para la página del carrito
export default function CartPage() {
  return (
    <div className="cart-page  mx-auto p-6" >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2"> {/* Aumentar el ancho del carrito de compras */}
          <CartItems />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
