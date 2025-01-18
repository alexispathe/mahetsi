// src/context/CartContext.jsx
'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import {
  getLocalCart,
  addToLocalCart,
  removeFromLocalCart,
  clearLocalCart,
} from '@/app/utils/cartLocalStorage';
import { auth } from '@/libs/firebaseClient';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser, authLoading } = useContext(AuthContext);

  // ====== CART ======
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ====== SHIPPING (usuarios autenticados) ======
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shippingQuotes, setShippingQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  // ====== GUEST ZIP CODE (usuarios NO autenticados) ======
  const [guestZipCode, setGuestZipCode] = useState('');

  // ---------------------------------------------
  // 1) Cargamos guestZipCode del localStorage, si existe
  // ---------------------------------------------
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedZip = localStorage.getItem('guestZipCode');
      if (storedZip) {
        setGuestZipCode(storedZip);
      }
    }
  }, []);

  const saveGuestZipCode = (zip) => {
    setGuestZipCode(zip);
    if (typeof window !== 'undefined') {
      localStorage.setItem('guestZipCode', zip);
    }
  };

  const saveGuestZipCodeAndFetchQuotes = async (zip) => {
    saveGuestZipCode(zip);
    await fetchShippingQuotes();
  };

  // ---------------------------------------------
  // 2) Cargar detalles de productos
  // ---------------------------------------------
  const fetchProductDetails = async (uniqueIDs) => {
    if (uniqueIDs.length === 0) {
      setProducts([]);
      return;
    }
    try {
      const response = await fetch('/api/shoppingCart/public/get/cartIds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIDs: uniqueIDs }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener detalles de productos.');
      }
      const enrichedData = await response.json();
      setProducts(enrichedData.products);
    } catch (err) {
      console.error('Error al obtener detalles de productos:', err);
      setError(err.message);
    }
  };

  // ---------------------------------------------
  // 3) Cargar carrito autenticado
  // ---------------------------------------------
  const loadAuthenticatedCart = async () => {
    try {
      const res = await fetch('/api/cart/getItems', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        if (res.status === 401) {
          // Sesión expirada
          await auth.signOut();
          setCartItems([]);
          setProducts([]);
          loadLocalCart();
          return;
        }
        const data = await res.json();
        throw new Error(data.error || 'Error al obtener el carrito');
      }

      const data = await res.json();
      const items = data.cartItems;

      // Sincronizar con localstorage
      const localCart = getLocalCart();
      if (localCart.length > 0) {
        for (const item of localCart) {
          await addItemToCart(item, false);
        }
        clearLocalCart();
      }

      setCartItems(items);
      const uniqueIDs = items.map((item) => item.uniqueID);
      await fetchProductDetails(uniqueIDs);

      // ===> AQUÍ buscamos la dirección principal
      await fetchDefaultAddress(); // <--- llamamos a la nueva función
    } catch (err) {
      console.error('Error al cargar el carrito autenticado:', err);
      setError(err.message);
    }
  };

  // ---------------------------------------------
  // 4) Cargar carrito local
  // ---------------------------------------------
  const loadLocalCart = () => {
    const items = getLocalCart();
    setCartItems(items);
    const uniqueIDs = items.map((i) => i.uniqueID);
    fetchProductDetails(uniqueIDs);
  };

  // ---------------------------------------------
  // 5) loadCart (elige si es auth o no)
  // ---------------------------------------------
  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentUser && authLoading === false) {
        // Usuario autenticado
        await loadAuthenticatedCart();
      } else {
        // Invitado
        loadLocalCart();
        // También podríamos cargar shippingAddress de localStorage si existiera, etc.
        if (!currentUser) {
          const savedAddress = localStorage.getItem('shippingAddress');
          if (savedAddress) {
            setShippingAddress(JSON.parse(savedAddress));
          }
        }
      }
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // 6) Nueva función: obtener dirección principal
  // ---------------------------------------------
  const fetchDefaultAddress = async () => {
    try {
      // Tu API puede ser: /api/addresses/private/get/list
      // o quizás tengas /api/addresses/private/get/default, etc.
      const res = await fetch('/api/addresses/private/get/list', {
        credentials: 'include',
      });
      if (!res.ok) {
        // Si da error, no forzamos nada
        console.error('No se pudo obtener la lista de direcciones');
        return;
      }
      const data = await res.json();
      const addresses = data.addresses || [];
      // Buscar la que tenga isDefault = true
      const defaultAddr = addresses.find((addr) => addr.isDefault === true);
      if (defaultAddr) {
        setShippingAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Error al obtener dirección por defecto:', error);
    }
  };

  // ---------------------------------------------
  // 7) Añadir Item al Carrito
  // ---------------------------------------------
  const addItemToCart = async (item, updateCount = true) => {
    if (currentUser) {
      try {
        const res = await fetch('/api/cart/addItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
          credentials: 'include',
        });
        if (!res.ok) {
          if (res.status === 401) {
            // Sesión expirada
            await auth.signOut();
            addToLocalCart(item);
            setCartItems((prev) => [...prev, { uniqueID: item.uniqueID, qty: item.qty }]);
            if (updateCount) {
              await fetchProductDetails([...cartItems.map((i) => i.uniqueID), item.uniqueID]);
            }
            return;
          }
          const data = await res.json();
          throw new Error(data.error || 'Error al agregar el producto al carrito.');
        }
        // Actualizar state
        setCartItems((prev) => {
          const existingItem = prev.find((i) => i.uniqueID === item.uniqueID);
          if (existingItem) {
            const newQty = existingItem.qty + item.qty;
            if (newQty <= 0) {
              return prev.filter((i) => i.uniqueID !== item.uniqueID);
            }
            return prev.map((i) => (i.uniqueID === item.uniqueID ? { ...i, qty: newQty } : i));
          } else {
            return [...prev, { uniqueID: item.uniqueID, qty: item.qty }];
          }
        });
        if (updateCount) {
          await fetchProductDetails([...cartItems.map((i) => i.uniqueID), item.uniqueID]);
        }
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        setError(error.message);
      }
    } else {
      // No auth
      addToLocalCart(item);
      setCartItems((prev) => {
        const existingItem = prev.find((i) => i.uniqueID === item.uniqueID);
        if (existingItem) {
          const newQty = existingItem.qty + item.qty;
          if (newQty <= 0) {
            return prev.filter((i) => i.uniqueID !== item.uniqueID);
          }
          return prev.map((i) =>
            i.uniqueID === item.uniqueID ? { ...i, qty: newQty } : i
          );
        } else {
          return [...prev, { uniqueID: item.uniqueID, qty: item.qty }];
        }
      });
      if (updateCount) {
        await fetchProductDetails([...cartItems.map((i) => i.uniqueID), item.uniqueID]);
      }
    }
  };

  // ---------------------------------------------
  // 8) Eliminar Item del Carrito
  // ---------------------------------------------
  const removeItemFromCart = async (uniqueID) => {
    if (currentUser) {
      try {
        const res = await fetch(`/api/cart/removeItem/${uniqueID}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al eliminar el producto del carrito.');
        }
        setCartItems((prev) => prev.filter((item) => item.uniqueID !== uniqueID));
        setProducts((prev) => prev.filter((product) => product.uniqueID !== uniqueID));
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        setError(error.message);
      }
    } else {
      removeFromLocalCart(uniqueID);
      setCartItems((prev) => prev.filter((item) => item.uniqueID !== uniqueID));
      setProducts((prev) => prev.filter((product) => product.uniqueID !== uniqueID));
    }
  };
  const removeItemFromCartHandler = async (uniqueID) => {
    await removeItemFromCart(uniqueID);
  };

  // ---------------------------------------------
  // 9) Limpiar Carrito
  // ---------------------------------------------
  const clearCart = () => {
    if (currentUser) {
      fetch('/api/cart/clear', {
        method: 'POST',
        credentials: 'include',
      })
        .then((res) => {
          if (res.ok) {
            setCartItems([]);
            setProducts([]);
          } else {
            return res.json().then((data) => {
              throw new Error(data.error || 'Error al limpiar el carrito.');
            });
          }
        })
        .catch((error) => {
          console.error('Error al limpiar el carrito:', error);
          setError(error.message);
        });
    } else {
      clearLocalCart();
      setCartItems([]);
      setProducts([]);
    }
  };

  // ---------------------------------------------
  // 10) Guardar Dirección
  // ---------------------------------------------
  const saveShippingAddress = (address) => {
    setShippingAddress(address);
    if (!currentUser) {
      localStorage.setItem('shippingAddress', JSON.stringify(address));
    }
  };

  // ---------------------------------------------
  // 11) Cotizar Envío
  // ---------------------------------------------
  const fetchShippingQuotes = async () => {
    setLoadingShipping(true);
    setShippingError(null);

    try {
      let addressToUse;

      if (currentUser) {
        if (!shippingAddress) {
          setShippingError('No hay dirección de envío.');
          setLoadingShipping(false);
          return;
        }
        addressToUse = shippingAddress;
      } else {
        // Invitado
        if (!guestZipCode) {
          setShippingError('No hay código postal para invitado.');
          setLoadingShipping(false);
          return;
        }
        addressToUse = {
          zipcode: guestZipCode,
          country: 'México',
        };
      }

      const response = await fetch('/api/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direccionDestino: addressToUse }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener las cotizaciones de envío.');
      }
      setShippingQuotes(data.all_quotes || []);
      setSelectedQuote(data.all_quotes?.[0] || null);
    } catch (err) {
      console.error('Error al obtener cotizaciones de envío:', err);
      setShippingError(err.message);
      setShippingQuotes([]);
      setSelectedQuote(null);
    } finally {
      setLoadingShipping(false);
    }
  };

  // ---------------------------------------------
  // 12) useEffect: cargar Carrito al montar
  // ---------------------------------------------
  useEffect(() => {
    // Esperamos a que termine authLoading para no hacer 2 requests
    if (!authLoading) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]);

  // ---------------------------------------------
  // 13) Contar items en el carrito
  // ---------------------------------------------
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  }, [cartItems]);

  // ---------------------------------------------
  return (
    <CartContext.Provider
      value={{
        cartItems,
        products,
        loading,
        error,
        addItemToCart,
        removeItemFromCart: removeItemFromCartHandler,
        clearCart,
        loadCart,
        cartCount,

        // Envío
        shippingAddress,
        saveShippingAddress,
        shippingQuotes,
        fetchShippingQuotes,
        selectedQuote,
        setSelectedQuote,
        loadingShipping,
        shippingError,

        // Guest Zip
        guestZipCode,
        saveGuestZipCode,
        saveGuestZipCodeAndFetchQuotes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
