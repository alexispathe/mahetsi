'use client'

import UserDetails from './UserDetails'; // Componente de los datos del usuario
import CartSummary from './CartSummary'; // Componente del resumen de compra
import Header from '../components/Header';
import '../styles/cart.css'
export default function CartPage() {
  return (
    <>
      <Header/>
      <div className="cart-page container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserDetails />  {/* Sección de dirección y forma de pago */}
        <CartSummary /> {/* Sección del resumen de la compra */}
      </div>
    </div>
    </>
   
  );
}
