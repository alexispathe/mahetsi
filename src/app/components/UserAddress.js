// src/components/UserAddress.js

'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAddressSchema } from '@/schemas/userAddressSchema';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

// Asegúrate de definir o importar 'estadosMexico'
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

export default function UserAddress({ addresses, selectedAddressId, setSelectedAddressId, setAddresses }) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para deshabilitar botones de guardar/actualizar
  const [deletingAddressIds, setDeletingAddressIds] = useState([]); // Para deshabilitar botones de borrar individualmente

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userAddressSchema),
  });

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para obtener las direcciones del usuario
  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses/private/get/list', {
        method: 'GET',
        credentials: 'include', // Asegura que las cookies se envíen
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
      } else {
        console.error(data.message || 'Error al obtener las direcciones');
      }
    } catch (error) {
      console.error('Error al obtener las direcciones:', error);
    }
  };

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEditing && editingAddress) {
        // Actualizar dirección existente
        const response = await fetch(`/api/addresses/private/update/${editingAddress.uniqueID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Asegura que las cookies se envíen
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          alert('Dirección actualizada exitosamente');
          fetchAddresses();
          setIsEditing(false);
          setEditingAddress(null);
          reset();
        } else {
          alert(result.message || 'Error al actualizar la dirección');
        }
      } else {
        // Crear nueva dirección
        const response = await fetch('/api/addresses/private/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Asegura que las cookies se envíen
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          alert('Dirección creada exitosamente');
          fetchAddresses();
          reset();
          setIsAddingNew(false);
        } else {
          alert(result.message || 'Error al crear la dirección');
        }
      }
    } catch (error) {
      console.error('Error al guardar la dirección:', error);
      alert('Error al guardar la dirección');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar la edición de una dirección
  const handleEdit = (address) => {
    setIsEditing(true);
    setEditingAddress(address);
    reset(address);
  };

  // Función para cancelar la edición o creación
  const handleCancel = () => {
    setIsEditing(false);
    setEditingAddress(null);
    setIsAddingNew(false);
    reset();
  };

  // Función para borrar una dirección
  const handleDelete = async (addressId) => {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta dirección?');
    if (!confirmDelete) return;

    setDeletingAddressIds(prev => [...prev, addressId]);

    try {
      const response = await fetch(`/api/addresses/private/delete/${addressId}`, {
        method: 'DELETE',
        credentials: 'include', // Asegura que las cookies se envíen
      });

      const result = await response.json();

      if (response.ok) {
        alert('Dirección eliminada exitosamente');
        fetchAddresses();
        // Si la dirección eliminada estaba seleccionada, deseleccionarla
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      } else {
        alert(result.message || 'Error al eliminar la dirección');
      }
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
      alert('Error al eliminar la dirección');
    } finally {
      setDeletingAddressIds(prev => prev.filter(id => id !== addressId));
    }
  };

  return (
    <div className="user-address-container bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Dirección de Envío</h2>

      {/* Mostrar direcciones existentes */}
      {addresses.length > 0 && !isAddingNew && !isEditing && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Selecciona una dirección existente:</h3>
          <div className="space-y-4">
            {addresses.map(address => (
              <div
                key={address.uniqueID}
                className={`p-4 border rounded-md ${selectedAddressId === address.uniqueID ? 'border-blue-500' : 'border-gray-300'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{address.firstName} {address.lastName}</p>
                    <p>{address.address}, {address.colonia}, {address.city}, {address.state}, C.P. {address.zipcode}</p>
                    <p>Teléfono: {address.phone}</p>
                    {address.reference && <p>Referencia: {address.reference}</p>}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      className={`text-blue-500 hover:text-blue-700 ${selectedAddressId === address.uniqueID ? 'font-bold' : ''}`}
                      onClick={() => setSelectedAddressId(address.uniqueID)}
                      disabled={isSubmitting || deletingAddressIds.includes(address.uniqueID)}
                    >
                      {selectedAddressId === address.uniqueID ? 'Seleccionada' : 'Seleccionar'}
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700 flex items-center"
                      onClick={() => handleEdit(address)}
                      disabled={isSubmitting || deletingAddressIds.includes(address.uniqueID)}
                    >
                      <FaEdit className="mr-1" /> Editar
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center"
                      onClick={() => handleDelete(address.uniqueID)}
                      disabled={isSubmitting || deletingAddressIds.includes(address.uniqueID)}
                    >
                      <FaTrash className="mr-1" /> Borrar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className={`mt-4 flex items-center text-blue-500 hover:text-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setIsAddingNew(true)}
            disabled={isSubmitting}
          >
            <FaPlus className="mr-2" /> Agregar nueva dirección
          </button>
        </div>
      )}

      {/* Formulario para agregar o editar una dirección */}
      {(isAddingNew || isEditing) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full p-2 border rounded border-gray-300"
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
              {isEditing ? 'Actualizar Dirección' : 'Guardar Dirección'}
            </button>
            <button
              type="button"
              className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Mostrar mensaje si no hay direcciones y opción para agregar */}
      {!isAddingNew && !isEditing && addresses.length === 0 && (
        <div>
          <p>No tienes direcciones guardadas.</p>
          <button
            className={`mt-4 flex items-center text-blue-500 hover:text-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setIsAddingNew(true)}
            disabled={isSubmitting}
          >
            <FaPlus className="mr-2" /> Agregar una dirección
          </button>
        </div>
      )}
    </div>
  );
}
