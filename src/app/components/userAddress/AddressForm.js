//Formulario para agregar una direccion desde el perfil o checkout
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAddressSchema } from '@/schemas/userAddressSchema';
import { estadosMexico } from '../shippingAddressModal/estadosMexico';

export default function AddressForm({
  isEditing,
  isSubmitting,
  initialData,
  onSubmit,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userAddressSchema),
  });

  // Prellenar valores si recibimos data (para editar)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset();
    }
  }, [initialData, reset]);

  const handleFormSubmit = (formData) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="firstName">
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            {...register('firstName')}
            className={`w-full p-2 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Nombre"
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="lastName">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            {...register('lastName')}
            className={`w-full p-2 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Apellido"
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="you@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Número de Teléfono */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="phone">
          Número de Teléfono
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Ej. 5512345678"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="address">
          Calle 
        </label>
        <input
          type="text"
          id="address"
          {...register('address')}
          className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Calle"
          disabled={isSubmitting}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>
      {/* Número de Apartamento */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="number">
          Número exterior
        </label>
        <input
          type="text"
          id="number"
          {...register('number')}
          className={`w-full p-2 border rounded ${errors.number ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Número de Apartamento"
          disabled={isSubmitting}
        />
        {errors.number && (
          <p className="text-red-500 text-sm">{errors.number.message}</p>
        )}
      </div>
      {/* Número Interior (Opcional) */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="interiorNumber">
          Número Interior (Opcional)
        </label>
        <input
          type="text"
          id="interiorNumber"
          {...register('interiorNumber')}
          className="w-full p-2 border rounded border-gray-300"
          placeholder="Número Interior"
          disabled={isSubmitting}
        />
      </div>



      {/* Colonia */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="colonia">
          Colonia
        </label>
        <input
          type="text"
          id="colonia"
          {...register('colonia')}
          className={`w-full p-2 border rounded ${errors.colonia ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Colonia"
          disabled={isSubmitting}
        />
        {errors.colonia && (
          <p className="text-red-500 text-sm">{errors.colonia.message}</p>
        )}
      </div>

      {/* Ciudad/Municipio */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="city">
          Ciudad/Municipio
        </label>
        <input
          type="text"
          id="city"
          {...register('city')}
          className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Ciudad o Municipio"
          disabled={isSubmitting}
        />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="state">
          Estado
        </label>
        <select
          id="state"
          {...register('state')}
          className={`w-full p-2 border rounded ${errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          disabled={isSubmitting}
        >
          <option value="">Selecciona un estado...</option>
          {estadosMexico.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className="text-red-500 text-sm">{errors.state.message}</p>
        )}
      </div>

      {/* Código Postal */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="zipcode">
          Código Postal
        </label>
        <input
          type="text"
          id="zipcode"
          {...register('zipcode')}
          className={`w-full p-2 border rounded ${errors.zipcode ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Código Postal"
          disabled={isSubmitting}
        />
        {errors.zipcode && (
          <p className="text-red-500 text-sm">{errors.zipcode.message}</p>
        )}
      </div>

      {/* Referencia */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="reference">
          Referencia
        </label>
        <input
          type="text"
          id="reference"
          {...register('reference')}
          className={`w-full p-2 border rounded ${errors.reference ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Casa, dificultad, etc."
          disabled={isSubmitting}
        />
        {errors.reference && (
          <p className="text-red-500 text-sm">{errors.reference.message}</p>
        )}
      </div>

      {/* Dirección entre calles (Opcional) */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="betweenStreets">
          Dirección entre calles (Opcional)
        </label>
        <input
          type="text"
          id="betweenStreets"
          {...register('betweenStreets')}
          className={`w-full p-2 border rounded ${errors.betweenStreets ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Entre calles"
          disabled={isSubmitting}
        />
        {errors.betweenStreets && (
          <p className="text-red-500 text-sm">{errors.betweenStreets.message}</p>
        )}
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
          <input
            type="checkbox"
            {...register('useBilling')}
            className="mr-2"
            disabled={isSubmitting}
          />
          Usar esta dirección para facturación
        </label>
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-4 mt-4">
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={isSubmitting}
        >
          {isEditing ? 'Actualizar Dirección' : 'Guardar Dirección'}
        </button>
        <button
          type="button"
          className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
