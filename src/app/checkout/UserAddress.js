'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAddressSchema } from '@/schemas/userAddressSchema';
// Lista completa de estados de México
const estadosMexico = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'México',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
];

export default function UserAddress() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(userAddressSchema),
  });

  const onSubmit = (data) => {
    console.log('Datos del formulario:', data);
    // Manejar el envío de los datos
  };



  return (
    <div className="user-details-container bg-white py-10 px-6 shadow-lg rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Información de Contacto */}
        <h2 className="text-3xl font-bold mb-6">Información de Contacto</h2>
        <div className="contact-info mb-8">
          {/* Email */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`w-full p-3 mt-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Número de Teléfono */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="phone">Número de Teléfono</label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className={`w-full p-3 mt-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej. 5512345678"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

        </div>

        {/* Dirección de Envío */}
        <h2 className="text-3xl font-bold mb-6">Dirección de Envío</h2>

        <div className="shipping-address mb-8">
          {/* Nombre y Apellido */}
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Nombre */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-lg font-semibold" htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                {...register('firstName')}
                className={`w-full p-3 mt-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nombre"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            {/* Apellido */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-lg font-semibold" htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                {...register('lastName')}
                className={`w-full p-3 mt-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Apellido"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          {/* País */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="country">País</label>
            <select
              id="country"
              {...register('country')}
              className="w-full p-3 mt-2 border rounded-md border-gray-300"
              defaultValue="México"
              disabled
            >
              <option value="México">México</option>
              {/* Si en el futuro permites otros países, puedes habilitar este campo */}
            </select>
          </div>
          {/* Estado */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="state">Estado</label>
            <select
              id="state"
              {...register('state')}
              className={`w-full p-3 mt-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecciona un estado...</option>
              {estadosMexico.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
          </div>

          {/* Ciudad/Municipio */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="city">Ciudad/Municipio</label>
            <input
              type="text"
              id="city"
              {...register('city')}
              className={`w-full p-3 mt-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ciudad o Municipio"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
          </div>

          {/* Colonia */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="colonia">Colonia</label>
            <input
              type="text"
              id="colonia"
              {...register('colonia')}
              className={`w-full p-3 mt-2 border rounded-md ${errors.colonia ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Colonia"
            />
            {errors.colonia && <p className="text-red-500 text-sm mt-1">{errors.colonia.message}</p>}
          </div>





          {/* Código Postal */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="zipcode">Código Postal</label>
            <input
              type="text"
              id="zipcode"
              {...register('zipcode')}
              className={`w-full p-3 mt-2 border rounded-md ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Código Postal"
            />
            {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>}
          </div>

          {/* Calle y Número Exterior */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="address">Calle y Número Exterior</label>
            <input
              type="text"
              id="address"
              {...register('address')}
              className={`w-full p-3 mt-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Calle y Número Exterior"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>

          {/* Número Interior (Opcional) */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="interiorNumber">Número Interior (Opcional)</label>
            <input
              type="text"
              id="interiorNumber"
              {...register('interiorNumber')}
              className="w-full p-3 mt-2 border rounded-md border-gray-300"
              placeholder="Número Interior"
            />
          </div>
          {/* Dirección entre calles */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="betweenStreets">Dirección entre calles</label>
            <input
              type="text"
              id="betweenStreets"
              {...register('betweenStreets')}
              className={`w-full p-3 mt-2 border rounded-md ${errors.betweenStreets ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Entre calles"
            />
            {errors.betweenStreets && <p className="text-red-500 text-sm mt-1">{errors.betweenStreets.message}</p>}
          </div>


          {/* Referencia */}
          <div className="mb-4">
            <label className="text-lg font-semibold" htmlFor="reference">Referencia</label>
            <input
              type="text"
              id="reference"
              {...register('reference')}
              className="w-full p-3 mt-2 border rounded-md border-gray-300"
              placeholder="Entre calles, edificio, etc."
            />
          </div>



          {/* Checkbox Usar para Facturación */}
          <div className="mt-4">
            <label className="text-sm flex items-center">
              <input type="checkbox" {...register('useBilling')} className="mr-2" />
              Usar esta dirección para facturación
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
