import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Item } from '../services/itemService';

type CartItem = {
  item: Item;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'DECREMENT_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.item.id === action.payload.item.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }

      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    case 'DECREMENT_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.item.id === action.payload
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        const currentQuantity = updatedItems[existingItemIndex].quantity;

        if (currentQuantity <= 1) {
          // Remove o item se a quantidade for 1 ou menos
          updatedItems.splice(existingItemIndex, 1);
        } else {
          // Decrementa a quantidade em 1
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: currentQuantity - 1
          };
        }

        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
      return state;
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.item.preco * item.quantity, 0);
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
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
