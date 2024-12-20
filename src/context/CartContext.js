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

  // Función para cargar el carrito al iniciar o al cambiar el usuario
  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      let items = [];

      if (currentUser) {
        // Obtener ítems del carrito desde la API
        console.log(currentUser)
        const res = await fetch('/api/cart/getItems', { method: 'GET', credentials: 'include' });

        if (!res.ok) {
        //   if (res.status === 401) {
        //     setError('La sesión ha expirado, por favor inicia sesión nuevamente.');
        //     setCartItems([]);
        //     setProducts([]);
        //     setLoading(false);
        //     await handleSignOut(); // Cerrar sesión en Firebase sin redirigir
        //     return;
        //   }
          const data = await res.json();
          throw new Error(data.error || 'Error al obtener el carrito');
        }

        const data = await res.json();
        items = data.cartItems;

        // Sincronizar con localStorage si hay ítems
        const localCart = getLocalCart();
        if (localCart.length > 0) {
          for (const item of localCart) {
            await addItemToCart(item, false); // false indica que no se desea actualizar el conteo aquí
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

  // Cargar el carrito cuando el componente se monta o el usuario cambia
  useEffect(() => {
    loadCart();
  }, [currentUser]);

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

        // Actualizar el estado local
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
        await fetchProductDetails([...cartItems.map(i => i.uniqueID), item.uniqueID]);
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
        // Solo actualizar detalles de productos si es una acción directa del usuario
        await fetchProductDetails([...cartItems.map(i => i.uniqueID), item.uniqueID]);
      }
    }
  };

  // Método para eliminar un producto del carrito
  const removeItemFromCart = async (uniqueID, size) => {
    if (currentUser) {
      // Eliminar del carrito en la base de datos vía API
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

        // Actualizar el estado local
        setCartItems(prev => prev.filter(item => !(item.uniqueID === uniqueID && item.size === size)));
        setProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        setError(error.message);
      }
    } else {
      // Eliminar del carrito en el localStorage
      removeFromLocalCart(uniqueID, size);
      setCartItems(prev => prev.filter(item => !(item.uniqueID === uniqueID && item.size === size)));
      setProducts(prev => prev.filter(product => product.uniqueID !== uniqueID));
    }
  };

  // Método para limpiar el carrito (opcional)
  const clearCart = () => {
    if (currentUser) {
      // Implementa la lógica para limpiar el carrito en la base de datos si es necesario
    } else {
      clearLocalCart();
      setCartItems([]);
      setProducts([]);
    }
  };

  // Sincronizar el carrito del localStorage al iniciar sesión
  useEffect(() => {
    const synchronizeCart = async () => {
      if (currentUser) {
        const localCart = getLocalCart();
        if (localCart.length > 0) {
          for (const item of localCart) {
            await addItemToCart(item, false); // false para no actualizar el conteo aquí
          }
          clearLocalCart();
          await loadCart(); // Recargar el carrito desde Firestore
        }
      }
    };

    synchronizeCart();
  }, [currentUser]);

  // Cálculo de cartCount usando useMemo para optimización
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
        loadCart, // Exponer si necesitas recargar manualmente
        cartCount, // Exponer el conteo total de productos
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
