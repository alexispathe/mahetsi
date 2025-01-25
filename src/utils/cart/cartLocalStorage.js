// src/utils/cartLocalStorage.js

export const CART_LOCAL_STORAGE_KEY = 'guest_cart';

export function getLocalCart() {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function addToLocalCart(item) {
  const cart = getLocalCart();
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.uniqueID === item.uniqueID && cartItem.size === item.size
  );

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].qty += item.qty;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(cart));
}

export function clearLocalCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_LOCAL_STORAGE_KEY);
}

export function removeFromLocalCart(uniqueID, size) {
  let cart = getLocalCart();
  cart = cart.filter((item) => !(item.uniqueID === uniqueID && item.size === size));
  localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(cart));
}
