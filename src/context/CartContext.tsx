import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Item } from '../types';

type CartItem = {
  item: Item;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  total: number;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (cartItem) => cartItem.item.id === action.payload.id
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((cartItem) =>
            cartItem.item.id === action.payload.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
          total: state.total + action.payload.preco,
        };
      }
      
      return {
        ...state,
        items: [...state.items, { item: action.payload, quantity: 1 }],
        total: state.total + action.payload.preco,
      };
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(
        (cartItem) => cartItem.item.id === action.payload
      );
      
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter(
          (cartItem) => cartItem.item.id !== action.payload
        ),
        total: state.total - itemToRemove.item.preco * itemToRemove.quantity,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      const itemToUpdate = state.items.find(
        (cartItem) => cartItem.item.id === itemId
      );
      
      if (!itemToUpdate || quantity < 1) return state;
      
      const priceDifference =
        (quantity - itemToUpdate.quantity) * itemToUpdate.item.preco;
        
      return {
        ...state,
        items: state.items.map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity }
            : cartItem
        ),
        total: state.total + priceDifference,
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
  });

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
