// src/hooks/useAddresses.js
import { useState } from 'react';
import { createAddressAPI, updateAddressAPI } from '@/services/cart/addressService';
import { toast } from 'react-toastify';

/**
 * Hook personalizado para manejar las direcciones.
 */
const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);

  /**
   * Obtiene la dirección por defecto del servidor.
   */
  const fetchDefaultAddress = async () => {
    try {
      const res = await fetch('/api/addresses/private/get/list', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch addresses');
      }
      const data = await res.json();
      const defaultAddr = data.addresses.find(addr => addr.isDefault) || null;
      setAddresses(data.addresses);
      return defaultAddr;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  /**
   * Crea una nueva dirección.
   * @param {Object} addressData - Datos de la dirección a crear.
   */
  const createAddress = async (addressData) => {
    try {
      const data = await createAddressAPI(addressData);
      toast.success('Dirección creada exitosamente');
      await fetchDefaultAddress();
      return data;
    } catch (error) {
      // El error ya se maneja en createAddressAPI
      throw error;
    }
  };

  /**
   * Actualiza una dirección existente.
   * @param {string} addressId - ID de la dirección a actualizar.
   * @param {Object} addressData - Nuevos datos de la dirección.
   */
  const updateAddress = async (addressId, addressData) => {
    try {
      const data = await updateAddressAPI(addressId, addressData);
      toast.success('Dirección actualizada exitosamente');
      await fetchDefaultAddress();
      return data;
    } catch (error) {
      // El error ya se maneja en updateAddressAPI
      throw error;
    }
  };

  return {
    addresses,
    fetchDefaultAddress,
    createAddress,
    updateAddress,
  };
};

export default useAddresses;
