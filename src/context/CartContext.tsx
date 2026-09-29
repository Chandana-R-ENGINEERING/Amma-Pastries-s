import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem, OrderType } from '../types';

interface CartContextType {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  reorderPastItems: (pastItems: OrderItem[]) => void;
  isOrderSchedulerOpen: boolean;
  setIsOrderSchedulerOpen: (open: boolean) => void;
  selectedOrderType: OrderType;
  setSelectedOrderType: (type: OrderType) => void;
  openOrderScheduler: (type?: OrderType) => void;
  closeOrderScheduler: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'amma_pastries_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderSchedulerOpen, setIsOrderSchedulerOpen] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('Regular Cake Order');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart items', e);
    }
  }, [items]);

  const addItem = (item: OrderItem) => {
    setItems((prev) => {
      // Check if identical item (same id, size, eggless, message) exists
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.isEggless === item.isEggless &&
          (i.messageOnCake || '') === (item.messageOnCake || '')
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const reorderPastItems = (pastItems: OrderItem[]) => {
    // Add all past items into the cart
    setItems((prev) => {
      const next = [...prev];
      pastItems.forEach((item) => {
        next.push({ ...item, quantity: item.quantity || 1 });
      });
      return next;
    });
    setIsCartOpen(true);
  };

  const openOrderScheduler = (type: OrderType = 'Regular Cake Order') => {
    setSelectedOrderType(type);
    setIsOrderSchedulerOpen(true);
  };

  const closeOrderScheduler = () => {
    setIsOrderSchedulerOpen(false);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItemCount,
        isCartOpen,
        setIsCartOpen,
        reorderPastItems,
        isOrderSchedulerOpen,
        setIsOrderSchedulerOpen,
        selectedOrderType,
        setSelectedOrderType,
        openOrderScheduler,
        closeOrderScheduler,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
