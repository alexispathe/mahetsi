// src/context/CartContext.jsx

'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { getLocalCart, addToLocalCart, removeFromLocalCart, clearLocalCart } from '@/app/utils/cartLocalStorage';
import { auth } from '@/libs/firebaseClient'; // Importar para usar auth.signOut()
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Nuevos estados para envío
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shippingQuotes, setShippingQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);

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

  const loadAuthenticatedCart = async () => {
    try {
      const res = await fetch('/api/cart/getItems', { method: 'GET', credentials: 'include' });
      
      // Si el servidor devuelve 401, significa que no hay sesión válida
      if (!res.ok) {
        if (res.status === 401) {
          // Sign out
          await auth.signOut();
          // Limpiar el cart del contexto
          setCartItems([]);
          setProducts([]);
          // Cargar el carrito local ya que el user ya no está logueado
          loadLocalCart();
          return; 
        }

        // Si es otro error distinto a 401
        const data = await res.json();
        throw new Error(data.error || 'Error al obtener el carrito');
      }

      const data = await res.json();
      const items = data.cartItems;

      // Sincronizar con localStorage si hay ítems
      const localCart = getLocalCart();
      if (localCart.length > 0) {
        for (const item of localCart) {
          await addItemToCart(item, false); 
        }
        clearLocalCart();
      }

      setCartItems(items);
      const uniqueIDs = items.map(item => item.uniqueID);
      await fetchProductDetails(uniqueIDs);
    } catch (err) {
      console.error('Error al cargar el carrito autenticado:', err);
      setError(err.message);
    }
  };

  const loadLocalCart = () => {
    const items = getLocalCart();
    setCartItems(items);
    const uniqueIDs = items.map(item => item.uniqueID);
    fetchProductDetails(uniqueIDs);
  };

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentUser && authLoading === false) {
        await loadAuthenticatedCart();
      } else {
        loadLocalCart();
      }

      // Cargar dirección de envío desde localStorage si no está autenticado
      if (!currentUser) {
        const savedAddress = localStorage.getItem('shippingAddress');
        if (savedAddress) {
          setShippingAddress(JSON.parse(savedAddress));
        }
      }
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (item, updateCount = true) => {
    if (currentUser) {
      try {
        const res = await fetch('/api/cart/addItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
          credentials: 'include'
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Sesión expirada o inválida
            await auth.signOut();
            // Cambiar a carrito local
            addToLocalCart(item);
            setCartItems(prev => [...prev, { uniqueID: item.uniqueID, qty: item.qty }]);
            if (updateCount) {
              await fetchProductDetails([...cartItems.map(i => i.uniqueID), item.uniqueID]);
            }
            return;
          }

          const data = await res.json();
          throw new Error(data.error || 'Error al agregar el producto al carrito.');
        }

        // Si todo va bien (sesión todavía válida)
        setCartItems(prev => {
          const existingItem = prev.find(i => i.uniqueID === item.uniqueID );
          if (existingItem) {
            const newQty = existingItem.qty + item.qty;
            if (newQty <= 0) {
              // Eliminar el item si la cantidad es 0 o menor
              return prev.filter(i => i.uniqueID !== item.uniqueID);
            }
            return prev.map(i =>
              i.uniqueID === item.uniqueID 
                ? { ...i, qty: newQty }
                : i
            );
          } else {
            return [...prev, { uniqueID: item.uniqueID, qty: item.qty }];
          }
        });
        
        if (updateCount) {
          await fetchProductDetails([...cartItems.map(i => i.uniqueID), item.uniqueID]);
        }

      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        setError(error.message);
      }
    } else {
      // Usuario no autenticado, usar localStorage
      addToLocalCart(item);
      setCartItems(prev => {
        const existingItem = prev.find(i => i.uniqueID === item.uniqueID);
        if (existingItem) {
          const newQty = existingItem.qty + item.qty;
          if (newQty <= 0) {
            // Eliminar el item si la cantidad es 0 o menor
            return prev.filter(i => i.uniqueID !== item.uniqueID);
          }
          return prev.map(i =>
            i.uniqueID === item.uniqueID 
              ? { ...i, qty: newQty }
              : i
          );
        } else {
          return [...prev, { uniqueID: item.uniqueID, qty: item.qty }];
        }
      });
      if (updateCount) {
        await fetchProductDetails([...cartItems.map(i => i.uniqueID), item.uniqueID]);
      }
    }
  };

  const removeItemFromCartHandler = async (uniqueID) => {
    // Manejador de eliminación externo para evitar conflictos de nombres
    await removeItemFromCart(uniqueID);
  };

  const removeItemFromCart = async (uniqueID) => {
    if (currentUser) {
      try {
        const res = await fetch(`/api/cart/removeItem/${uniqueID}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al eliminar el producto del carrito.');
        }

        setCartItems(prev => prev.filter(item => item.uniqueID !== uniqueID));
        setProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        setError(error.message);
      }
    } else {
      // Usuario no autenticado, usar localStorage
      removeFromLocalCart(uniqueID);
      setCartItems(prev => prev.filter(item => item.uniqueID !== uniqueID));
      setProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
    }
  };

  const clearCart = () => {
    if (currentUser) {
      // Implementa la lógica para limpiar el carrito en el servidor
      fetch('/api/cart/clear', {
        method: 'POST',
        credentials: 'include'
      })
      .then(res => {
        if (res.ok) {
          setCartItems([]);
          setProducts([]);
        } else {
          return res.json().then(data => {
            throw new Error(data.error || 'Error al limpiar el carrito.');
          });
        }
      })
      .catch(error => {
        console.error('Error al limpiar el carrito:', error);
        setError(error.message);
      });
    } else {
      // Usuario no autenticado, limpiar localStorage
      clearLocalCart();
      setCartItems([]);
      setProducts([]);
    }
  };

  // Funciones para manejar la dirección de envío y cotizaciones
  const saveShippingAddress = (address) => {
    setShippingAddress(address);
    if (!currentUser) {
      localStorage.setItem('shippingAddress', JSON.stringify(address));
    }
  };

  const fetchShippingQuotes = async () => {
    if (!shippingAddress) {
      setShippingError('No hay dirección de envío.');
      return;
    }

    setLoadingShipping(true);
    setShippingError(null);
    try {
      const response = await fetch('/api/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direccionDestino: shippingAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener las cotizaciones de envío.');
      }

      setShippingQuotes(data.all_quotes || []);
      setSelectedQuote(data.all_quotes[0] || null); // Seleccionar automáticamente la primera opción
    } catch (err) {
      console.error('Error al obtener cotizaciones de envío:', err);
      setShippingError(err.message);
      setShippingQuotes([]);
      setSelectedQuote(null);
    } finally {
      setLoadingShipping(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      // Si el usuario se autentica y hay una dirección de envío en localStorage, puedes manejarla aquí
      const savedAddress = localStorage.getItem('shippingAddress');
      if (savedAddress) {
        // Opcional: Implementar lógica para transferir esta dirección al perfil del usuario
        // Por ejemplo, mostrar una notificación o un modal preguntando si desea guardar la dirección
        // Por simplicidad, la dejaremos en localStorage hasta que se sincronice con las direcciones de usuario
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      // Limpiar la dirección de envío almacenada en localStorage al iniciar sesión
      localStorage.removeItem('shippingAddress');
    }
  }, [currentUser]);

  useEffect(() => {
    if (!authLoading) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  }, [cartItems]);

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
        // Nuevas propiedades y funciones
        shippingAddress,
        saveShippingAddress,
        shippingQuotes,
        fetchShippingQuotes,
        selectedQuote,
        setSelectedQuote,
        loadingShipping,
        shippingError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
