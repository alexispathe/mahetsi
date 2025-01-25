// src/services/addressService.js

/**
 * Crea una nueva dirección en el servidor.
 * @param {Object} addressData - Datos de la dirección a crear.
 */
export const createAddressAPI = async (addressData) => {
    const response = await fetch('/api/addresses/private/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
      credentials: 'include',
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Error creating address');
    }
    return data;
  };
  
  /**
   * Actualiza una dirección existente en el servidor.
   * @param {string} addressId - ID de la dirección a actualizar.
   * @param {Object} addressData - Nuevos datos de la dirección.
   */
  export const updateAddressAPI = async (addressId, addressData) => {
    const response = await fetch(`/api/addresses/private/update/${addressId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
      credentials: 'include',
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Error updating address');
    }
    return data;
  };
  