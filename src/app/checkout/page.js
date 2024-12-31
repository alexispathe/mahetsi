'use client'

import UserAddress from './UserAddress'; // Componente de los datos del usuario
import CartSummary from './CartSummary'; // Componente del resumen de compra
import Header from '../components/Header';
import PaymentInformation  from './PaymentInformation';

export default function CartPage() {
  return (
    <div className='user-details-container bg-white py-10 px-6 shadow-lg rounded-lg'>
      <Header position="relative" textColor="text-black" />
      <div className="cart-page container mx-auto pt-20 p-6"> {/* Aquí agregamos pt-24 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserAddress />  {/* Sección de dirección y forma de pago */}
          <CartSummary /> {/* Sección del resumen de la compra */}
          <PaymentInformation/>
        </div>
      </div>
    </div>
  );
}
