// src/components/ShippingAddressModal.jsx

'use client';

import React, { useState, useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAddressSchema } from '@/schemas/userAddressSchema'; // Reutilizamos el esquema de validación existente
import { toast } from 'react-toastify';

export default function ShippingAddressModal({ isOpen, onClose }) {
  const { saveShippingAddress } = useContext(CartContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userAddressSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Puedes agregar lógica adicional aquí si necesitas guardar la dirección en el backend
      saveShippingAddress(data);
      toast.success('Dirección de envío guardada exitosamente');
      reset();
      onClose();
    } catch (error) {
      console.error('Error al guardar la dirección de envío:', error);
      toast.error('Error al guardar la dirección de envío');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-4">Agregar Dirección de Envío</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="firstName">Nombre</label>
            <input
              type="text"
              id="firstName"
              {...register('firstName')}
              className={`w-full p-2 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nombre"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="lastName">Apellido</label>
            <input
              type="text"
              id="lastName"
              {...register('lastName')}
              className={`w-full p-2 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Apellido"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Número de Teléfono */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">Número de Teléfono</label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej. 5512345678"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="address">Calle y Número Exterior</label>
            <input
              type="text"
              id="address"
              {...register('address')}
              className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Calle y Número Exterior"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          {/* Número Interior (Opcional) */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="interiorNumber">Número Interior (Opcional)</label>
            <input
              type="text"
              id="interiorNumber"
              {...register('interiorNumber')}
              className={`w-full p-2 border rounded border-gray-300`}
              placeholder="Número Interior"
            />
          </div>

          {/* Colonia */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="colonia">Colonia</label>
            <input
              type="text"
              id="colonia"
              {...register('colonia')}
              className={`w-full p-2 border rounded ${errors.colonia ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Colonia"
            />
            {errors.colonia && <p className="text-red-500 text-sm">{errors.colonia.message}</p>}
          </div>

          {/* Ciudad/Municipio */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="city">Ciudad/Municipio</label>
            <input
              type="text"
              id="city"
              {...register('city')}
              className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ciudad o Municipio"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="state">Estado</label>
            <select
              id="state"
              {...register('state')}
              className={`w-full p-2 border rounded ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecciona un estado...</option>
              {estadosMexico.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>

          {/* Código Postal */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="zipcode">Código Postal</label>
            <input
              type="text"
              id="zipcode"
              {...register('zipcode')}
              className={`w-full p-2 border rounded ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Código Postal"
            />
            {errors.zipcode && <p className="text-red-500 text-sm">{errors.zipcode.message}</p>}
          </div>

          {/* Referencia */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="reference">Referencia</label>
            <input
              type="text"
              id="reference"
              {...register('reference')}
              className={`w-full p-2 border rounded ${errors.reference ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Casa, dificultad, etc."
            />
            {errors.reference && <p className="text-red-500 text-sm">{errors.reference.message}</p>}
          </div>

          {/* Dirección entre calles (Opcional) */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="betweenStreets">Dirección entre calles (Opcional)</label>
            <input
              type="text"
              id="betweenStreets"
              {...register('betweenStreets')}
              className={`w-full p-2 border rounded ${errors.betweenStreets ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Entre calles"
            />
            {errors.betweenStreets && <p className="text-red-500 text-sm">{errors.betweenStreets.message}</p>}
          </div>

          {/* País (Fijo) */}
          <div className="hidden">
            <input
              type="text"
              id="country"
              {...register('country')}
              defaultValue="México"
            />
          </div>

          {/* Checkbox Usar para Facturación */}
          <div className="mt-4">
            <label className="text-sm flex items-center">
              <input type="checkbox" {...register('useBilling')} className="mr-2" />
              Usar esta dirección para facturación
            </label>
          </div>

          {/* Botones de Acción */}
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              Guardar Dirección
            </button>
            <button
              type="button"
              className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center`}
              onClick={() => { reset(); onClose(); }}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Lista de estados de México para el formulario
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
