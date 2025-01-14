# Contexto Ativo

## 🔄 Estado Global

### AppState
```typescript
interface AppState {
  user: User | null;
  cart: Carrinho | null;
  items: Item[];
  loading: boolean;
  error: string | null;
}
```

### AppAction
```typescript
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CART'; payload: Carrinho | null }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_TO_CART'; payload: ItemCarrinho }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
```

## 🎯 Hooks Personalizados

### useAppContext
```typescript
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};
```

### useCart
```typescript
const useCart = () => {
  const { state, dispatch } = useAppContext();
  
  const addToCart = async (itemId: number, quantity: number) => {
    try {
      if (!state.user) {
        throw new Error('Usuário não autenticado');
      }

      let currentCart = state.cart;
      if (!currentCart) {
        currentCart = await carrinhoService.createCarrinho({
          usuarioId: state.user.id,
          dataCriacao: new Date().toISOString(),
          status: 0,
          itensCarrinho: []
        });
        dispatch({ type: 'SET_CART', payload: currentCart });
      }

      const item = await itemCarrinhoService.addItemToCart({
        carrinhoId: currentCart.id,
        itemId,
        quantidade: quantity
      });

      dispatch({ type: 'ADD_TO_CART', payload: item });
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      if (!state.cart) return;
      
      await itemCarrinhoService.removeItemFromCart(itemId);
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw error;
    }
  };

  const getItemQuantity = (itemId: number) => {
    return state.cart?.itensCarrinho?.find(item => item.itemId === itemId)?.quantidade || 0;
  };

  const getCartTotal = () => {
    return state.cart?.itensCarrinho?.reduce((total, item) => {
      const itemPrice = state.items.find(i => i.id === item.itemId)?.preco || 0;
      return total + (itemPrice * item.quantidade);
    }, 0) || 0;
  };

  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getCartTotal
  };
};
```

### useAuth
```typescript
const useAuth = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const login = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await authService.login();
      dispatch({ type: 'SET_USER', payload: user });
      navigate('/');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao fazer login' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_CART', payload: null });
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout
  };
};
```

## 🔒 Proteção de Rotas

### PrivateRoute
```typescript
interface PrivateRouteProps {
  roles?: string[];
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

## 🌐 Fluxo de Autenticação

1. Usuário acessa rota protegida
2. PrivateRoute verifica autenticação
3. Se não autenticado, redireciona para login
4. Auth0 processa autenticação
5. Callback redireciona de volta
6. Token é armazenado
7. Usuário é redirecionado para rota original

## 🛒 Fluxo do Carrinho

1. Usuário adiciona item
2. Verifica autenticação
3. Cria carrinho se não existir
4. Adiciona item ao carrinho
5. Atualiza estado global
6. Persiste no backend
7. Atualiza UI
