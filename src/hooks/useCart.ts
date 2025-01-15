import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Item } from '../services/itemService';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { state, dispatch } = context;

  const addToCart = (item: Item, quantity: number = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { item, quantity }
    });
  };

  const decrementFromCart = (itemId: number) => {
    dispatch({
      type: 'DECREMENT_ITEM',
      payload: itemId
    });
  };

  const removeFromCart = (itemId: number) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: itemId
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return {
    items: state.items,
    total: state.total,
    addToCart,
    decrementFromCart,
    removeFromCart,
    clearCart
  };
}; 