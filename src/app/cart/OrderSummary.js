'use client'

import { FaPaypal } from 'react-icons/fa'; // Usando el ícono de Paypal

function OrderSummary() {
  const subtotal = 422.99;
  const shipping = 0.00;
  const grandTotal = subtotal + shipping + 45.89; // Incluyendo impuestos

  return (
    <section className="order-summary bg-[#1c1f28] text-white rounded-lg shadow-md p-6">
      <h3 className="text-3xl font-bold mb-4">Order Summary</h3>
      
      {/* Subtotal */}
      <div className="mb-4">
        <p className="text-sm">Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
      </div>

      {/* Shipping */}
      <div className="mb-4">
        <p className="text-sm">Shipping: <span className="font-semibold">Will be set at checkout</span></p>
      </div>

      {/* Grand Total */}
      <div className="mb-4">
        <p className="text-sm">Grand Total: <span className="font-semibold">${grandTotal.toFixed(2)}</span> <span className="text-xs">(Inc $45.89 sales tax)</span></p>
      </div>

      {/* Coupon Code */}
      <div className="mb-4">
        <label className="text-sm">Have a coupon code?</label>
        <input type="text" className="w-full p-3 mt-2 text-black rounded-md" placeholder="Enter coupon code" />
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-4">
        <button className="w-full bg-white text-[#1c1f28] py-3 px-4 rounded-md hover:bg-gray-200">
          Proceed to checkout
        </button>
        <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600">
          <FaPaypal className="inline-block mr-2 text-xl" /> Checkout with PayPal
        </button>
      </div>
    </section>
  );
}

export default OrderSummary;
