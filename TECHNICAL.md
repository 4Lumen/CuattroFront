# Documentação Técnica - Cuattro

## Arquitetura do Sistema

### Frontend (React + TypeScript)

#### Estrutura de Diretórios
```
src/
├── components/          # Componentes React reutilizáveis
│   ├── admin/          # Componentes específicos para área administrativa
│   ├── employee/       # Componentes específicos para funcionários
│   └── customer/       # Componentes para área do cliente
├── context/            # Contextos React e gerenciamento de estado
├── hooks/              # Hooks customizados
├── pages/              # Componentes de página
├── services/           # Serviços de API e integrações
├── types/              # Definições de tipos TypeScript
└── utils/              # Funções utilitárias
```

#### Principais Tecnologias
- React 18.x
- TypeScript 5.x
- Material-UI 5.x
- Tailwind CSS 3.x
- React Router 6.x
- Auth0 SDK

### Backend (.NET)

#### Estrutura de Diretórios
```
src/
├── API/               # Projeto principal da API
├── Core/              # Lógica de negócios e entidades
├── Infrastructure/    # Implementações de persistência
└── Tests/             # Testes unitários e de integração
```

#### Principais Tecnologias
- .NET 9.0
- Entity Framework Core
- PostgreSQL
- MinIO Client
- Auth0 Management API

## Fluxos de Autenticação

### Auth0 Integration
1. Configuração inicial no arquivo `authService.ts`:
```typescript
const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};
```

2. Fluxo de Login:
```typescript
async function login() {
  try {
    await auth0Client.loginWithPopup({
      prompt: 'select_account'
    });
    const user = await auth0Client.getUser();
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

### Controle de Acesso
- Roles definidas no Auth0:
  - ADMIN (2)
  - EMPLOYEE (1)
  - CUSTOMER (0)

## APIs e Integração

### Endpoints Principais

#### Items API
```typescript
// GET /api/items
async function getItems(): Promise<Item[]>

// POST /api/items
async function createItem(item: CreateItemDTO): Promise<Item>

// PUT /api/items/{id}
async function updateItem(id: number, item: UpdateItemDTO): Promise<Item>

// DELETE /api/items/{id}
async function deleteItem(id: number): Promise<void>
```

#### Orders API
```typescript
// POST /api/orders
async function createOrder(order: CreateOrderDTO): Promise<Order>

// GET /api/orders/{id}
async function getOrder(id: number): Promise<Order>

// PUT /api/orders/{id}/status
async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order>
```

### Tratamento de Erros
```typescript
// apiService.ts
const handleApiError = (error: any) => {
  if (error.response) {
    // Erro do servidor com resposta
    throw new ApiError(error.response.data.message, error.response.status);
  } else if (error.request) {
    // Erro de rede
    throw new NetworkError('Erro de conexão com o servidor');
  } else {
    // Erro desconhecido
    throw new UnknownError('Ocorreu um erro inesperado');
  }
};
```

## Gerenciamento de Estado

### AppContext
```typescript
interface AppState {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_ORDERS'; payload: Order[] };
```

### Hooks Customizados
```typescript
// useCart.ts
const useCart = () => {
  const { state, dispatch } = useAppContext();
  
  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };
  
  const removeFromCart = (itemId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };
  
  return { cart: state.cart, addToCart, removeFromCart };
};
```

## Componentes Principais

### Navbar
- Navegação responsiva
- Controle de autenticação
- Menu adaptativo baseado em roles

### CustomerPage
- Listagem de itens
- Carrinho de compras
- Finalização de pedido

### AdminPage
- CRUD de itens
- Gerenciamento de pedidos
- Relatórios

## Estilização

### Tema Material-UI
```typescript
// theme.ts
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
});
```

### Tailwind CSS
- Configuração em `tailwind.config.js`
- Integração com Material-UI
- Classes utilitárias personalizadas

## Testes

### Jest + React Testing Library
```typescript
// Navbar.test.tsx
describe('Navbar', () => {
  it('should render login button when user is not authenticated', () => {
    render(<Navbar />);
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('should render user menu when authenticated', () => {
    const user = { name: 'Test User', role: 0 };
    render(<Navbar />, {
      wrapper: ({ children }) => (
        <AppProvider initialState={{ user, cart: [], orders: [] }}>
          {children}
        </AppProvider>
      )
    });
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });
});
```

## Deploy e CI/CD

### Build
```bash
# Produção
npm run build

# Desenvolvimento
npm run build:dev
```

### Variáveis de Ambiente
- `.env.development`
- `.env.production`
- `.env.test`

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Segurança

### Práticas Implementadas
1. Autenticação via Auth0
2. JWT com refresh tokens
3. HTTPS forçado
4. Headers de segurança
5. Sanitização de inputs
6. Validação de dados
7. Rate limiting

### Headers de Segurança
```typescript
// Configuração no servidor nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## Monitoramento e Logs

### Error Tracking
```typescript
// errorService.ts
const logError = (error: Error, context?: any) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
  
  // Enviar para serviço de monitoramento
  // Ex: Sentry, LogRocket, etc.
};
```

## Contribuição

### Processo de Desenvolvimento
1. Fork do repositório
2. Criar branch feature/fix
3. Desenvolver com TDD
4. Criar Pull Request
5. Code Review
6. Merge após aprovação

### Padrões de Código
- ESLint + Prettier
- Conventional Commits
- TypeScript strict mode
- Documentação JSDoc 