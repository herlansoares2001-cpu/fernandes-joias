'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  sku: string | null;
  size: string | null;
  engravingText: string;
  unitPrice: number;
  imageUrl: string | null;
  quantity: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; sku: string | null; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ITEMS'; items: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        (i) => i.productId === action.item.productId && i.sku === action.item.sku && i.engravingText === action.item.engravingText
      );
      if (existing) {
        return state.map((i) =>
          i.productId === action.item.productId && i.sku === action.item.sku && i.engravingText === action.item.engravingText
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
      }
      return [...state, action.item];
    }
    case 'REMOVE_ITEM':
      return state.filter(
        (i) => !(i.productId === action.productId && i.sku === action.sku)
      );
    case 'CLEAR_CART':
      return [];
    case 'SET_ITEMS':
      return action.items;
    default:
      return state;
  }
}

const CART_KEY = 'fj_cart_v1';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, sku: string | null) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart items on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        dispatch({ type: 'SET_ITEMS', items: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load cart items from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart items when updated
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', item });
  };

  const removeItem = (productId: string, sku: string | null) => {
    dispatch({ type: 'REMOVE_ITEM', productId, sku });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
