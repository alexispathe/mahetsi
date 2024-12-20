'use client';

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { getLocalCart, addToLocalCart, removeFromLocalCart, clearLocalCart } from '@/app/utils/cartLocalStorage';
import { auth } from '@/libs/firebaseClient'; // Importar Firebase Auth

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]); // [{ uniqueID, size, qty }, ...]
  const [products, setProducts] = useState([]);   // Detalles de productos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener los detalles de los productos a partir de los uniqueIDs
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

  // Función para cargar el carrito
  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      let items = [];

      if (currentUser) {
        // Obtener ítems del carrito desde la API
        const res = await fetch('/api/cart/getItems', { method: 'GET', credentials: 'include' });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al obtener el carrito');
        }

        const data = await res.json();
        items = data.cartItems;

        // Sincronizar con localStorage si hay ítems
        const localCart = getLocalCart();
        if (localCart.length > 0) {
          for (const item of localCart) {
            await addItemToCart(item, false); 
          }
          clearLocalCart();
        }
      } else {
        // Usuario no autenticado: obtener ítems desde localStorage
        items = getLocalCart();
      }

      setCartItems(items);
      const uniqueIDs = items.map(item => item.uniqueID);
      await fetchProductDetails(uniqueIDs);
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión en Firebase sin redirigir
  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Cerrar sesión de Firebase
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Método para agregar un producto al carrito
  const addItemToCart = async (item, updateCount = true) => {
    if (currentUser) {
      // Agregar al carrito en la base de datos vía API
      try {
        const res = await fetch('/api/cart/addItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al agregar el producto al carrito.');
        }

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
      // Agregar al carrito en el localStorage
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

  // Método para eliminar un producto del carrito
  const removeItemFromCart = async (uniqueID, size) => {
    if (currentUser) {
      try {
        const res = await fetch('/api/cart/removeItem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uniqueID, size }),
        });

        if (!res.ok) {
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

  // Método para limpiar el carrito (opcional)
  const clearCart = () => {
    if (currentUser) {
      // Implementar si se desea limpiar en Firestore
    } else {
      clearLocalCart();
      setCartItems([]);
      setProducts([]);
    }
  };

  // Esperar a que se establezca la cookie antes de cargar el carrito si el usuario está logueado
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        if (document.cookie.includes('session=')) {
          clearInterval(interval);
          loadCart();
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      // Si no hay usuario, se carga directamente
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

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
