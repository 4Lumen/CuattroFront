import React, { createContext, useContext, useReducer } from 'react';
import { AppState, AppAction, User, Carrinho, Item } from '../types';

const initialState: AppState = {
  user: null,
  cart: null,
  items: []
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const useAppContext = () => useContext(AppContext);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload
      };
    case 'ADD_TO_CART':
      if (!state.cart) return state;

      const existingItem = state.cart.itensCarrinho?.find(
        item => item.itemId === action.payload.item.id
      );

      const updatedItensCarrinho = existingItem
        ? state.cart.itensCarrinho?.map(item =>
            item.itemId === action.payload.item.id
              ? { ...item, quantidade: item.quantidade + action.payload.quantity }
              : item
          )
        : [
            ...(state.cart.itensCarrinho || []),
            {
              id: Date.now(), // Temporary ID until backend sync
              carrinhoId: state.cart.id,
              itemId: action.payload.item.id,
              quantidade: action.payload.quantity,
              item: action.payload.item
            }
          ];

      return {
        ...state,
        cart: {
          ...state.cart,
          itensCarrinho: updatedItensCarrinho
        }
      };

    case 'REMOVE_FROM_CART':
      if (!state.cart) return state;

      return {
        ...state,
        cart: {
          ...state.cart,
          itensCarrinho: state.cart.itensCarrinho?.filter(
            item => item.itemId !== action.payload
          )
        }
      };

    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
