// Formulario de direccion para el modal
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

// Importamos el esquema zod
import { userAddressSchema } from '@/schemas/userAddressSchema';
// Importamos el array de estados de México
import { estadosMexico } from './estadosMexico';

export default function ShippingAddressForm({
  isSubmitting,
  setIsSubmitting,
  shippingAddress,
  saveShippingAddress,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(userAddressSchema),
  });

  // Efecto para prellenar datos cuando se abra el modal
  useEffect(() => {
    if (shippingAddress) {
      setValue('firstName', shippingAddress.firstName);
      setValue('lastName', shippingAddress.lastName);
      setValue('email', shippingAddress.email);
      setValue('phone', shippingAddress.phone);
      setValue('address', shippingAddress.address);
      setValue('interiorNumber', shippingAddress.interiorNumber || '');
      setValue('number', shippingAddress.number || ''); // nuevo campo
      setValue('colonia', shippingAddress.colonia);
      setValue('city', shippingAddress.city);
      setValue('state', shippingAddress.state);
      setValue('zipcode', shippingAddress.zipcode);
      setValue('reference', shippingAddress.reference || '');
      setValue('betweenStreets', shippingAddress.betweenStreets || '');
      setValue('country', shippingAddress.country || 'México');
      setValue('useBilling', shippingAddress.useBilling || false);
    } else {
      reset();
    }
  }, [shippingAddress, setValue, reset]);

  // Handler para el envío del formulario
  const onSubmitHandler = async (data) => {
    setIsSubmitting(true);
    try {
      await saveShippingAddress(data);
      toast.success('Dirección de envío guardada exitosamente');
      reset();
      onClose();
    } catch (error) {
      toast.error('Hubo un error al guardar la dirección de envío.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
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

      <div>
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
            placeholder="Número exterior"
            disabled={isSubmitting}
          />
          {errors.number && (
            <p className="text-red-500 text-sm">{errors.number.message}</p>
          )}
        </div>
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

      {/* País (oculto, fijo en 'México') */}
      <div className="hidden">
        <input
          type="text"
          id="country"
          {...register('country')}
          defaultValue="México"
        />
      </div>

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

      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="button"
          className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition-colors duration-300"
          onClick={() => {
            reset();
            onClose();
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center transition-colors duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Guardando...
            </>
          ) : (
            'Guardar Dirección'
          )}
        </button>
      </div>

    </form>
  );
}
