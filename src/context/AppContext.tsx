import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction } from '../types';
import AuthService from '../services/authService';

const initialState: AppState = {
  user: null,
  cart: null,
  items: [],
  loading: true,
  error: null
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};

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
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload
      };
    case 'ADD_TO_CART': {
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          itensCarrinho: [
            ...(state.cart.itensCarrinho || []),
            { 
              id: Date.now(), // Temporário até ser substituído pelo backend
              carrinhoId: state.cart.id,
              itemId: action.payload.item.id,
              quantidade: action.payload.quantity,
              item: action.payload.item
            }
          ]
        }
      };
    }
    case 'REMOVE_FROM_CART':
      if (!state.cart?.itensCarrinho) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          itensCarrinho: state.cart.itensCarrinho.filter(
            item => item.id !== action.payload
          )
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let isSubscribed = true;
    let checkInterval: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        // Verifica se ainda devemos processar o resultado
        if (!isSubscribed) return;

        // Verifica se estamos em um callback de autenticação
        if (window.location.search.includes('code=') && 
            window.location.search.includes('state=')) {
          console.log('Detectado callback de autenticação, processando...');
          const user = await AuthService.handleRedirectCallback();
          if (user && isSubscribed) {
            dispatch({ type: 'SET_USER', payload: user });
            return;
          }
        }

        // Verifica autenticação normal
        const user = await AuthService.getCurrentUser();
        if (isSubscribed) {
          if (user) {
            console.log('Usuário autenticado:', user);
            dispatch({ type: 'SET_USER', payload: user });
          } else {
            console.log('Nenhum usuário autenticado');
            dispatch({ type: 'SET_USER', payload: null });
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (isSubscribed) {
          dispatch({ type: 'SET_USER', payload: null });
        }
      }
    };

    // Verifica a autenticação quando o componente é montado
    checkAuth();

    // Configura o intervalo apenas se não estivermos em um callback
    if (!window.location.search.includes('code=')) {
      checkInterval = setInterval(checkAuth, 5 * 60 * 1000); // A cada 5 minutos
    }

    // Verifica a autenticação quando a janela ganha foco
    const handleFocus = () => {
      // Não verifica novamente se estivermos em um callback
      if (!window.location.search.includes('code=')) {
        console.log('Janela ganhou foco, verificando autenticação...');
        checkAuth();
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isSubscribed = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
