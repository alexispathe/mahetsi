// src/app/not-found.js
import Link from 'next/link'
export default function Custom404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl text-gray-600">¡Oops! La página que buscas no existe.</p>
        <Link
          href="/"
          
        >
         <span className="mt-4 inline-block px-6 py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600" >Regresar al inicio</span>
        </Link>
      </div>
    </div>
  );
}
