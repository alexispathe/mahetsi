// src/services/cartService.js
import { auth, db } from '@/libs/firebaseClient';
/**
 * Obtiene los elementos del carrito del servidor.
 */
export const fetchCartItems = async () => {
  const res = await fetch('/api/cart/getItems', {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 401) {
      await auth.signOut();
      throw new Error('Session expired');
    }
    const data = await res.json();
    throw new Error(data.error || 'Error fetching cart');
  }
  const data = await res.json();
  return data.cartItems;
};

/**
 * Añade un elemento al carrito en el servidor.
 * @param {Object} item - El elemento a añadir.
 */
export const addItemToCartAPI = async (item) => {
  const res = await fetch('/api/cart/addItem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 401) {
      await auth.signOut();
      throw new Error('Session expired');
    }
    const data = await res.json();
    throw new Error(data.error || 'Error adding item to cart');
  }
  const data = await res.json();
  return data;
};

/**
 * Elimina un elemento del carrito en el servidor.
 * @param {string} uniqueID - ID único del elemento a eliminar.
 */
export const removeItemFromCartAPI = async (uniqueID) => {
  const res = await fetch(`/api/cart/removeItem/${uniqueID}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Error removing item from cart');
  }
  return data;
};

/**
 * Limpia todo el carrito en el servidor.
 */
export const clearCartAPI = async () => {
  const res = await fetch('/api/cart/clear', {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Error clearing cart');
  }
  return data;
};
