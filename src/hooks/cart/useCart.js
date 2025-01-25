// src/hooks/useCart.js
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import {
  getLocalCart,
  addToLocalCart,
  removeFromLocalCart,
  clearLocalCart,
  CART_LOCAL_STORAGE_KEY
} from '@/utils/cart/cartLocalStorage';
import { fetchCartItems, addItemToCartAPI, removeItemFromCartAPI, clearCartAPI } from '@/services/cart/cartService';
import { collection, onSnapshot } from 'firebase/firestore';
import { db} from '@/libs/firebaseClient';
import { toast } from 'react-toastify';

/**
 * Hook personalizado para manejar la lógica del carrito.
 */
const useCart = () => {
  const { currentUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  /**
   * Carga el carrito desde el servidor o localStorage según el estado de autenticación.
   */
  const loadCart = async () => {
    if (currentUser) {
      try {
        const items = await fetchCartItems();
        setCartItems(items);
      } catch (error) {
        toast.error(error.message);
        // Manejo adicional del error si es necesario
      }
    } else {
      const localCart = getLocalCart();
      setCartItems(localCart);
    }
  };

  /**
   * Añade un elemento al carrito.
   * @param {Object} item - Elemento a añadir.
   */
  const addItemToCart = async (item) => {
    if (currentUser) {
      try {
        await addItemToCartAPI(item);
        setCartItems((prev) => {
          const existingItem = prev.find(i => i.uniqueID === item.uniqueID);
          if (existingItem) {
            return prev.map(i => 
              i.uniqueID === item.uniqueID 
                ? { ...i, qty: i.qty + item.qty } 
                : i
            );
          } else {
            return [...prev, { uniqueID: item.uniqueID, qty: item.qty }];
          }
        });
        toast.success('Producto agregado al carrito');
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      addToLocalCart(item);
      setCartItems((prev) => {
        const existingItem = prev.find(i => i.uniqueID === item.uniqueID);
        if (existingItem) {
          return prev.map(i => 
            i.uniqueID === item.uniqueID 
              ? { ...i, qty: i.qty + item.qty } 
              : i
          );
        } else {
          return [...prev, { uniqueID: item.uniqueID, qty: item.qty }];
        }
      });
      toast.success('Producto agregado al carrito');
    }
  };

  /**
   * Elimina un elemento del carrito.
   * @param {string} uniqueID - ID único del elemento a eliminar.
   */
  const removeItemFromCart = async (uniqueID) => {
    if (currentUser) {
      try {
        await removeItemFromCartAPI(uniqueID);
        setCartItems((prev) => prev.filter(item => item.uniqueID !== uniqueID));
        toast.success('Producto eliminado del carrito');
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      removeFromLocalCart(uniqueID);
      setCartItems((prev) => prev.filter(item => item.uniqueID !== uniqueID));
      toast.success('Producto eliminado del carrito');
    }
  };

  /**
   * Limpia todo el carrito.
   */
  const clearCart = async () => {
    if (currentUser) {
      try {
        await clearCartAPI();
        setCartItems([]);
        toast.success('Carrito limpio');
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      clearLocalCart();
      setCartItems([]);
      toast.success('Carrito limpio');
    }
  };

  /**
   * Escucha cambios en localStorage para usuarios invitados.
   */
  useEffect(() => {
    if (!currentUser) {
      const handleStorageChange = (event) => {
        if (event.key === CART_LOCAL_STORAGE_KEY) {
          const newCart = getLocalCart();
          setCartItems(newCart);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [currentUser]);

  /**
   * Suscripción en tiempo real a Firestore para usuarios autenticados.
   */
  useEffect(() => {
    if (currentUser) {
      const itemsRef = collection(db, 'carts', currentUser.uid, 'items');

      const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
        const newCartItems = [];
        snapshot.forEach((doc) => {
          newCartItems.push(doc.data());
        });
        setCartItems(newCartItems);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  return {
    cartItems,
    loadCart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
  };
};

export default useCart;
