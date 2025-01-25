// src/hooks/useShipping.js
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetchShippingQuotesAPI } from '@/services/cart/shippingService';
import { toast } from 'react-toastify';

/**
 * Hook personalizado para manejar la lógica de envío.
 */
const useShipping = () => {
  const { currentUser } = useContext(AuthContext);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shippingQuotes, setShippingQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  /**
   * Obtiene cotizaciones de envío.
   * @param {Object} direccionDestino - Dirección de destino para el envío.
   */
  const fetchShippingQuotes = async (direccionDestino) => {
    setLoadingShipping(true);
    setShippingError(null);
    try {
      const quotes = await fetchShippingQuotesAPI(direccionDestino);
      setShippingQuotes(quotes);
      setSelectedQuote(quotes[0] || null);
    } catch (error) {
      setShippingError(error.message);
      toast.error(error.message);
    } finally {
      setLoadingShipping(false);
    }
  };

  /**
   * Crea una nueva dirección y actualiza las cotizaciones de envío.
   * @param {Object} addressData - Datos de la dirección a guardar.
   */
  const saveShippingAddress = async (addressData) => {
    try {
      let updatedAddress;
      if (currentUser) {
        if (shippingAddress) {
          updatedAddress = await updateAddress(shippingAddress.uniqueID, addressData);
        } else {
          updatedAddress = await createAddress(addressData);
        }
      } else {
        updatedAddress = addressData;
        localStorage.setItem('shippingAddress', JSON.stringify(addressData));
      }
      setShippingAddress(updatedAddress);
      await fetchShippingQuotes(updatedAddress);
      toast.success('Dirección de envío guardada');
    } catch (error) {
      // El error ya se maneja en createAddress y updateAddress
      throw error;
    }
  };

  return {
    shippingAddress,
    setShippingAddress,
    shippingQuotes,
    selectedQuote,
    setSelectedQuote,
    loadingShipping,
    shippingError,
    fetchShippingQuotes,
    saveShippingAddress,
  };
};

export default useShipping;
