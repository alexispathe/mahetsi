'use client';

import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { AuthContext } from '../AuthContext'; // Ajusta la ruta según donde esté tu AuthContext
import {
  getLocalCart,
  addToLocalCart,
  removeFromLocalCart,
  clearLocalCart,
  CART_LOCAL_STORAGE_KEY
} from '@/app/utils/cartLocalStorage';

import { auth, db } from '@/libs/firebaseClient';
import { collection, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';

export function useCartProvider() {
  const { currentUser, authLoading } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
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
  // 1) Cargar guestZipCode del localStorage
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
    await fetchShippingQuotes(zip);
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
        throw new Error(
          errorData.message || 'Error al obtener detalles de productos.'
        );
      }
      const enrichedData = await response.json();
      setProducts(enrichedData.products);
    } catch (err) {
      console.error('Error al obtener detalles de productos:', err);
      setError(err.message);
    }
  };

  // ---------------------------------------------
  // 3) Cargar carrito autenticado (vía API)
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

      // Sincronizar con localstorage (si hay algo guardado)
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

      // Obtener dirección por defecto
      await fetchDefaultAddress();
    } catch (err) {
      console.error('Error al cargar el carrito autenticado:', err);
      setError(err.message);
    }
  };

  // ---------------------------------------------
  // 4) Cargar carrito local (invitado)
  // ---------------------------------------------
  const loadLocalCart = () => {
    const items = getLocalCart();
    setCartItems(items);
    const uniqueIDs = items.map((i) => i.uniqueID);
    fetchProductDetails(uniqueIDs);
  };

  // ---------------------------------------------
  // 5) loadCart
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
  // 6) Obtener dirección por defecto (Auth)
  // ---------------------------------------------
  const fetchDefaultAddress = async () => {
    try {
      const res = await fetch('/api/addresses/private/get/list', {
        credentials: 'include',
      });
      if (!res.ok) {
        console.error('No se pudo obtener la lista de direcciones');
        return null;
      }
      const data = await res.json();
      const addresses = data.addresses || [];
      // Buscamos la dirección marcada como default
      const defaultAddr = addresses.find((addr) => addr.isDefault) || null;
      if (defaultAddr) {
        setShippingAddress(defaultAddr);
      } else {
        setShippingAddress(null);
      }
      return defaultAddr;
    } catch (error) {
      console.error('Error al obtener dirección por defecto:', error);
      return null;
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
            setCartItems((prev) => [
              ...prev,
              { uniqueID: item.uniqueID, qty: item.qty },
            ]);
            if (updateCount) {
              await fetchProductDetails([
                ...cartItems.map((i) => i.uniqueID),
                item.uniqueID,
              ]);
            }
            return;
          }
          const data = await res.json();
          throw new Error(
            data.error || 'Error al agregar el producto al carrito.'
          );
        }
        // Actualizamos en el estado local
        setCartItems((prev) => {
          const existingItem = prev.find((i) => i.uniqueID === item.uniqueID);
          if (existingItem) {
            const newQty = existingItem.qty + item.qty;
            if (newQty <= 0) {
              return prev.filter((i) => i.uniqueID !== item.uniqueID);
            }
            return prev.map((i) =>
              i.uniqueID === item.uniqueID
                ? { ...i, qty: newQty }
                : i
            );
          } else {
            return [...prev, { uniqueID: item.uniqueID, qty: item.qty }];
          }
        });
        if (updateCount) {
          await fetchProductDetails([
            ...cartItems.map((i) => i.uniqueID),
            item.uniqueID,
          ]);
        }
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        setError(error.message);
      }
    } else {
      // Invitado
      addToLocalCart(item);
      setCartItems((prev) => {
        const existingItem = prev.find((i) => i.uniqueID === item.uniqueID);
        if (existingItem) {
          const newQty = existingItem.qty + item.qty;
          if (newQty <= 0) {
            return prev.filter((i) => i.uniqueID !== item.uniqueID);
          }
          return prev.map((i) =>
            i.uniqueID === item.uniqueID
              ? { ...i, qty: newQty }
              : i
          );
        } else {
          return [...prev, { uniqueID: item.uniqueID, qty: item.qty }];
        }
      });
      if (updateCount) {
        await fetchProductDetails([
          ...cartItems.map((i) => i.uniqueID),
          item.uniqueID,
        ]);
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
          throw new Error(
            data.error || 'Error al eliminar el producto del carrito.'
          );
        }
        setCartItems((prev) =>
          prev.filter((item) => item.uniqueID !== uniqueID)
        );
        setProducts((prev) =>
          prev.filter((product) => product.uniqueID !== uniqueID)
        );
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        setError(error.message);
      }
    } else {
      removeFromLocalCart(uniqueID);
      setCartItems((prev) =>
        prev.filter((item) => item.uniqueID !== uniqueID)
      );
      setProducts((prev) =>
        prev.filter((product) => product.uniqueID !== uniqueID)
      );
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
  // 10) Crear / Actualizar dirección y guardar en la store
  // ---------------------------------------------
  const createAddress = async (addressData) => {
    try {
      const response = await fetch('/api/addresses/private/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Dirección creada exitosamente');
        // Retornamos la dirección por defecto
        const newDefault = await fetchDefaultAddress();
        return newDefault;
      } else {
        const errorMessage = data.message || 'Error al crear la dirección';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error al crear la dirección:', error);
      toast.error('Hubo un error al crear la dirección.');
      throw error;
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await fetch(
        `/api/addresses/private/update/${addressId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addressData),
          credentials: 'include',
        }
      );
      const data = await response.json();

      if (response.ok) {
        const newDefault = await fetchDefaultAddress();
        return newDefault;
      } else {
        const errorMessage = data.message || 'Error al actualizar la dirección';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error al actualizar la dirección:', error);
      toast.error('Hubo un error al actualizar la dirección.');
      throw error;
    }
  };

  // ---------------------------------------------
  // 11) Guardar Dirección => recalcular envío
  // ---------------------------------------------
  const saveShippingAddress = async (addressData) => {
    if (currentUser) {
      let updatedDefaultAddress;
      if (shippingAddress) {
        updatedDefaultAddress = await updateAddress(
          shippingAddress.uniqueID,
          addressData
        );
      } else {
        updatedDefaultAddress = await createAddress(addressData);
      }
      await fetchShippingQuotes(null, updatedDefaultAddress);
    } else {
      setGuestZipCode(addressData.zipcode);
      localStorage.setItem('shippingAddress', JSON.stringify(addressData));
      await fetchShippingQuotes(null, addressData);
    }
  };

  // ---------------------------------------------
  // 12) Cotizar Envío
  // ---------------------------------------------
  const fetchShippingQuotes = async (zip = null, addressOverride = null) => {
    setLoadingShipping(true);
    setShippingError(null);

    try {
      let addressToUse;

      if (addressOverride) {
        addressToUse = addressOverride;
      } else if (currentUser) {
        if (!shippingAddress) {
          setShippingError('No hay dirección de envío.');
          setLoadingShipping(false);
          return;
        }
        addressToUse = shippingAddress;
      } else {
        const effectiveZip = zip || guestZipCode;
        if (!effectiveZip) {
          setShippingError('No hay código postal para invitado.');
          setLoadingShipping(false);
          return;
        }
        addressToUse = {
          zipcode: effectiveZip,
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
  // 13) useEffect para cargar Carrito al montar
  // ---------------------------------------------
  useEffect(() => {
    if (!authLoading) {
      loadCart();
      if (currentUser) {
        fetchDefaultAddress();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading]);

  // ---------------------------------------------
  // (A) Listener de localStorage (para invitados)
  // ---------------------------------------------
  useEffect(() => {
    // Solo escuchar si NO estás autenticado (opcional).
    if (!currentUser) {
      const handleStorageChange = (event) => {
        if (event.key === CART_LOCAL_STORAGE_KEY) {
          const newCart = getLocalCart();
          setCartItems(newCart);
          const uniqueIDs = newCart.map((item) => item.uniqueID);
          fetchProductDetails(uniqueIDs);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [currentUser]);

  // ---------------------------------------------
  // (B) Suscripción en tiempo real (Firestore)
  // ---------------------------------------------
  useEffect(() => {
    // Si el usuario está autenticado, suscribirse a "carts/{uid}/items"
    if (currentUser) {
      const itemsRef = collection(db, 'carts', currentUser.uid, 'items');

      // Suscripción en tiempo real
      const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
        const newCartItems = [];
        snapshot.forEach((doc) => {
          newCartItems.push(doc.data());
        });
        setCartItems(newCartItems);
        // Refrescamos también la info de productos
        const uniqueIDs = newCartItems.map((item) => item.uniqueID);
        fetchProductDetails(uniqueIDs);
      });

      // Al desmontar o cambiar de usuario, nos desuscribimos
      return () => unsubscribe();
    }
  }, [currentUser]);

  // ---------------------------------------------
  // 14) Contar items en el carrito
  // ---------------------------------------------
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  }, [cartItems]);

  // Retornamos todo lo que se usará en el Provider
  return {
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

    // Direcciones (Auth)
    createAddress,
    updateAddress,
    fetchDefaultAddress,
  };
}
