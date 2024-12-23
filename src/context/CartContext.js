// src/context/CartContext.jsx

'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { getLocalCart, addToLocalCart, removeFromLocalCart, clearLocalCart } from '@/app/utils/cartLocalStorage';
import { auth } from '@/libs/firebaseClient'; // Importar para usar auth.signOut()

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
            setCartItems(prev => [...prev, item]);
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
          const existingItem = prev.find(i => i.uniqueID === item.uniqueID && i.size === item.size);
          if (existingItem) {
            return prev.map(i =>
              i.uniqueID === item.uniqueID && i.size === item.size
                ? { ...i, qty: i.qty + item.qty }
                : i
            );
          } else {
            return [...prev, item];
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
        const existingItem = prev.find(i => i.uniqueID === item.uniqueID && i.size === item.size);
        if (existingItem) {
          return prev.map(i =>
            i.uniqueID === item.uniqueID && i.size === item.size
              ? { ...i, qty: i.qty + item.qty }
              : i
          );
        } else {
          return [...prev, item];
        }
      });
      if (updateCount) {
        await fetchProductDetails([...cartItems.map(i => i.uniqueID), item.uniqueID]);
      }
    }
  };

  const removeItemFromCart = async (uniqueID, size) => {
    if (currentUser) {
      try {
        const res = await fetch('/api/cart/removeItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uniqueID, size }),
          credentials: 'include'
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Sesión expirada
            await auth.signOut();
            removeFromLocalCart(uniqueID, size);
            setCartItems(prev => prev.filter(item => !(item.uniqueID === uniqueID && item.size === size)));
            setProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
            return;
          }

          const data = await res.json();
          throw new Error(data.error || 'Error al eliminar el producto del carrito.');
        }

        setCartItems(prev => prev.filter(item => !(item.uniqueID === uniqueID && item.size === size)));
        setProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        setError(error.message);
      }
    } else {
      removeFromLocalCart(uniqueID, size);
      setCartItems(prev => prev.filter(item => !(item.uniqueID === uniqueID && item.size === size)));
      setProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
    }
  };

  const clearCart = () => {
    if (currentUser) {
      // Si quisieras limpiar el carrito en Firestore puedes hacerlo aquí
    } else {
      clearLocalCart();
      setCartItems([]);
      setProducts([]);
    }
  };

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
        removeItemFromCart,
        clearCart,
        loadCart, 
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
