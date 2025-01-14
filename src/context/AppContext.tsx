import React, { createContext, useContext, useReducer } from 'react';
import { User, Carrinho } from '../types';

interface AppState {
  cart: Carrinho | null;
  user: User | null;
}

type Action = 
  | { type: 'ADD_TO_CART'; payload: Carrinho }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_USER'; payload: User | null };

const initialState: AppState = {
  cart: null,
  user: null
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return { ...state, cart: action.payload };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: null };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
