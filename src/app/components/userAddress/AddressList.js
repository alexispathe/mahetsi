'use client';

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function AddressList({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  deletingAddressIds,
  isSubmitting,
  onDelete,
  onEdit,
  onSetDefault,
}) {
  if (!addresses || addresses.length === 0) {
    return <p>No tienes direcciones guardadas.</p>;
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.uniqueID}
          className={`p-4 border rounded-md ${
            selectedAddressId === address.uniqueID
              ? 'border-blue-500'
              : 'border-gray-300'
          }`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start">
            {/* Contenedor Nombre + botón “Principal” */}
            <div className="w-full">
              <div className="flex items-center flex-wrap">
                <p className="font-semibold">
                  {address.firstName} {address.lastName}
                  {address.isDefault && (
                    <span className="ml-2 text-xs text-white bg-green-500 px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                </p>
                {/* Si no es principal, muestra el botón para establecer como principal */}
                {!address.isDefault && (
                  <button
                    className="text-blue-500 ml-10 hover:text-blue-700 mt-2 lg:mt-0"
                    onClick={() => onSetDefault(address.uniqueID)}
                    disabled={
                      isSubmitting || deletingAddressIds.includes(address.uniqueID)
                    }
                  >
                    Establecer como principal
                  </button>
                )}
              </div>

              {/* Detalles de la dirección */}
              <p className="mt-2">
                {address.address}, {address.colonia}, {address.city},{' '}
                {address.state}, C.P. {address.zipcode}
              </p>
              <p>Teléfono: {address.phone}</p>
              {address.reference && <p>Referencia: {address.reference}</p>}
            </div>

            <div className="flex flex-row md:flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 mt-4 lg:mt-0 w-full lg:w-auto">
              {/* Botón para Seleccionar dirección */}
              <button
                className={`text-blue-500 hover:text-blue-700 ${
                  selectedAddressId === address.uniqueID ? 'font-bold' : ''
                } w-full lg:w-auto`}
                onClick={() => setSelectedAddressId(address.uniqueID)}
                disabled={
                  isSubmitting || deletingAddressIds.includes(address.uniqueID)
                }
              >
                {selectedAddressId === address.uniqueID
                  ? 'Seleccionada'
                  : 'Seleccionar'}
              </button>

              {/* Botón Editar */}
              <button
                className="text-green-500 hover:text-green-700 flex items-center w-full lg:w-auto"
                onClick={() => onEdit(address)}
                disabled={
                  isSubmitting || deletingAddressIds.includes(address.uniqueID)
                }
              >
                <FaEdit className="mr-1" /> Editar
              </button>

              {/* Botón Borrar */}
              <button
                className="text-red-500 hover:text-red-700 flex items-center w-full lg:w-auto"
                onClick={() => onDelete(address.uniqueID)}
                disabled={
                  isSubmitting || deletingAddressIds.includes(address.uniqueID)
                }
              >
                <FaTrash className="mr-1" /> Borrar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
