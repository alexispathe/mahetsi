'use client';

import React from 'react';
import { CartContext } from './CartContext';
import { useCartProvider } from './useCartProvider';

export const CartProvider = ({ children }) => {
  const cart = useCartProvider();

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};
