// src/app/components/userAddress/UserAddress.js

'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Subcomponentes
import AddressList from './AddressList';
import AddressForm from './AddressForm';
import SkeletonUserAddress from './SkeletonUserAddress'; // Nuevo componente de Skeleton

export default function UserAddress({
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId,
  loading, // Nuevo prop
}) {
  // Estados locales
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingAddressIds, setDeletingAddressIds] = useState([]);

  useEffect(() => {
    if (!loading) {
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Obtener direcciones del usuario
  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses/private/get/list', {
        method: 'GET',
        credentials: 'include',
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

  // Manejo de envío del formulario (crear o editar)
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEditing && editingAddress) {
        // Actualizar dirección existente
        const response = await fetch(
          `/api/addresses/private/update/${editingAddress.uniqueID}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          toast.success('Dirección actualizada exitosamente');
          fetchAddresses();
          setIsEditing(false);
          setEditingAddress(null);
        } else {
          toast.error('Error al actualizar la dirección');
        }
      } else {
        // Crear nueva dirección
        const response = await fetch('/api/addresses/private/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        if (response.ok) {
          toast.success('Dirección creada exitosamente');
          fetchAddresses();
          setIsAddingNew(false);
        } else {
          toast.error('Error al crear la dirección');
        }
      }
    } catch (error) {
      toast.error('Error al guardar la dirección');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejo de editar
  const handleEdit = (address) => {
    setIsEditing(true);
    setEditingAddress(address);
    setIsAddingNew(false);
  };

  // Manejo de cancelar (nuevo o edición)
  const handleCancel = () => {
    setIsEditing(false);
    setEditingAddress(null);
    setIsAddingNew(false);
  };

  // Manejo de borrar
  const handleDelete = async (addressId) => {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta dirección?');
    if (!confirmDelete) return;

    setDeletingAddressIds((prev) => [...prev, addressId]);

    try {
      const response = await fetch(`/api/addresses/private/delete/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Dirección eliminada exitosamente');
        fetchAddresses();
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      } else {
        toast.error('Error al eliminar la dirección');
      }
    } catch (error) {
      toast.error('Error al eliminar la dirección');
    } finally {
      setDeletingAddressIds((prev) => prev.filter((id) => id !== addressId));
    }
  };

  // Establecer como principal
  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch('/api/addresses/private/setDefault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ addressId }),
      });
      if (response.ok) {
        toast.success('Se ha seleccionado la dirección principal');
        fetchAddresses();
        setSelectedAddressId(addressId);
      } else {
        toast.error('No se pudo establecer la dirección principal');
      }
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al establecer la dirección principal');
    }
  };

  if (loading) {
    return <SkeletonUserAddress />; // Mostrar Skeleton mientras carga
  }

  return (
    <div className="user-address-container">
      <h2 className="text-2xl font-bold mb-4">Mis Direcciones de Envío</h2>

      {/* Si no estamos creando ni editando, mostramos lista y botón de "Agregar" */}
      {!isAddingNew && !isEditing && (
        <>
          {addresses.length > 0 ? (
            <>
              <AddressList
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                deletingAddressIds={deletingAddressIds}
                isSubmitting={isSubmitting}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSetDefault={handleSetDefault}
              />
              <button
                className={`mt-4 flex items-center text-blue-500 hover:text-blue-700 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => setIsAddingNew(true)}
                disabled={isSubmitting}
              >
                <FaPlus className="mr-2" /> Agregar nueva dirección
              </button>
            </>
          ) : (
            <>
              <p>No tienes direcciones guardadas.</p>
              <button
                className={`mt-4 flex items-center text-blue-500 hover:text-blue-700 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => setIsAddingNew(true)}
                disabled={isSubmitting}
              >
                <FaPlus className="mr-2" /> Agregar una dirección
              </button>
            </>
          )}
        </>
      )}

      {/* Formulario para agregar o editar */}
      {(isAddingNew || isEditing) && (
        <AddressForm
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          initialData={editingAddress}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
