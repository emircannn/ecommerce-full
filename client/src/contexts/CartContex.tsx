/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import request from '@/utils/request';

interface CartContextType {
    cartCount: number
    cartId: string
    setCartCount: React.Dispatch<React.SetStateAction<number>>
    handleGetCartCount: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartId, setCartId] = useState<string>('');

  useEffect(() => {
    const session_id = localStorage.getItem('session_id');
    if(!session_id) {
        const id = nanoid();
        localStorage.setItem('session_id', id)
    }
  }, [])
  

  const handleGetCartCount = useCallback(async() => {
    try {
        const session_id = localStorage.getItem('session_id');
        const res = await request({url: `/cart/getCount?session_id=${session_id}`, method: 'get'})
        setCartCount(res.data.data)
        setCartId(res.data.cart_id)
    } catch (error: any) {
        throw new Error(error)
    }
  }, [])

  useEffect(() => {
    handleGetCartCount()
  }, [handleGetCartCount])
  

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, handleGetCartCount, cartId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};