'use client'

import OrderSummary from './orderSummary';
import Header from '../components/Header';
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
    <>
      <Header />
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
    </>
  );
}


// Componente principal para la página del carrito
export default function CartPage() {
  return (
    <div className="cart-page mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2"> {/* Aumentar el ancho del carrito de compras */ }
          <CartItems />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
