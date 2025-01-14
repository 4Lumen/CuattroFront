# Documentação Técnica - Buffet App

## 🏗️ Arquitetura

### Context API
O aplicativo utiliza a Context API do React para gerenciamento de estado global:

```typescript
interface AppState {
  user: User | null;
  cart: Carrinho | null;
  items: Item[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CART'; payload: Carrinho | null }
  | { type: 'ADD_TO_CART'; payload: { item: Item; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_ITEMS'; payload: Item[] }
```

### Hooks Personalizados

#### useCart
Hook para gerenciamento do carrinho de compras:

```typescript
const useCart = () => {
  // Retorna funções para manipulação do carrinho
  return {
    cart,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getCartTotal
  };
};
```

### Serviços

#### itemCarrinhoService
```typescript
const ItemCarrinhoService = {
  async addItemToCart(itemCarrinho: Omit<ItemCarrinho, 'id'>): Promise<ItemCarrinho>;
  async updateCartItem(id: number, itemCarrinho: Partial<ItemCarrinho>): Promise<ItemCarrinho>;
  async removeItemFromCart(carrinhoId: number, itemId: number): Promise<void>;
};
```

## 🎨 Componentes

### MenuItem
Componente para exibição de itens do cardápio:

```typescript
interface MenuItemProps {
  item: Item;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}
```

### MenuFilter
Componente para filtro de categorias:

```typescript
interface MenuFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}
```

## 🎯 Fluxos Principais

### Adicionar Item ao Carrinho
1. Usuário clica em "Adicionar" no `MenuItem`
2. `useCart.addToCart` é chamado
3. Verifica se existe um carrinho
4. Cria novo carrinho se necessário
5. Adiciona item ao carrinho
6. Atualiza estado global

### Remover Item do Carrinho
1. Usuário clica em remover no `MenuItem`
2. `useCart.removeFromCart` é chamado
3. Remove item do carrinho via API
4. Atualiza estado global

## 🎨 Tema e Estilização

### Material-UI Theme
```typescript
const theme = {
  palette: {
    primary: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#FF4848'
    },
    secondary: {
      main: '#4ECDC4',
      light: '#71D7D0',
      dark: '#3BAFA8'
    }
  }
};
```

### Tailwind CSS
Configuração personalizada com:
- Cores primárias e secundárias
- Sistema de grid responsivo
- Animações e transições
- Modo escuro

## 📱 Responsividade

### Breakpoints
- xs: 0px
- sm: 600px
- md: 960px
- lg: 1280px
- xl: 1920px

### Grid System
Utiliza o sistema de grid do Material-UI com Tailwind:
```jsx
<Grid container spacing={4}>
  <Grid item xs={12} md={3}>
    {/* Sidebar */}
  </Grid>
  <Grid item xs={12} md={9}>
    {/* Content */}
  </Grid>
</Grid>
```

## 🔒 Segurança

### Autenticação
- Implementada com Auth0
- Roles: Cliente, Funcionário, Admin
- Token JWT para requisições API

### Proteção de Rotas
```typescript
interface ProtectedRouteProps {
  requiredRole: Role;
  children: React.ReactNode;
}
```

## 🚀 Performance

### Otimizações
- Lazy loading de componentes
- Memoização de componentes pesados
- Debounce em operações frequentes
- Caching de dados da API

### Code Splitting
```typescript
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const EmployeePage = React.lazy(() => import('./pages/EmployeePage'));
```

## 🧪 Testes

### Estrutura de Testes
```
__tests__/
├── components/
├── hooks/
└── services/
```

### Exemplos de Testes
```typescript
describe('useCart', () => {
  it('should add item to cart', async () => {
    // Implementação do teste
  });

  it('should remove item from cart', async () => {
    // Implementação do teste
  });
});
```

## 📦 Build e Deploy

### Processo de Build
```bash
# Instalação de dependências
npm install

# Build de produção
npm run build

# Testes
npm run test

# Lint
npm run lint
```

### Variáveis de Ambiente
- `REACT_APP_API_URL`: URL da API
- `REACT_APP_AUTH0_DOMAIN`: Domínio Auth0
- `REACT_APP_AUTH0_CLIENT_ID`: Client ID Auth0

## 🐛 Debugging

### Logs
```typescript
const logger = {
  error: (message: string, error: Error) => {
    console.error(`[Error] ${message}:`, error);
  },
  info: (message: string, data?: any) => {
    console.log(`[Info] ${message}:`, data);
  }
};
```

### Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error Boundary caught an error', error);
  }
}
``` 