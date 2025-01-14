# Contexto Técnico

## 🏗️ Arquitetura

### Frontend
- React 18 com TypeScript
- Material UI v5
- Tailwind CSS
- React Router v6
- Auth0 para autenticação
- Context API para estado global
- Axios para requisições HTTP

### Backend
- .NET 7 Web API
- Entity Framework Core
- SQL Server
- Swagger/OpenAPI
- JWT Authentication
- Azure Blob Storage

## 🔧 Configuração

### Ambiente de Desenvolvimento
```bash
# Instalação
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm run test
```

### Variáveis de Ambiente
```env
# API
REACT_APP_API_URL=https://api.cuattro.4lumen.com

# Auth0
REACT_APP_AUTH0_DOMAIN=cuattro.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_client_id
REACT_APP_AUTH0_AUDIENCE=https://buffet-app.4lumen.com

# Roles
REACT_APP_ROLE_ADMIN=admin
REACT_APP_ROLE_EMPLOYEE=employee
REACT_APP_ROLE_CUSTOMER=customer
```

## 📦 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
├── context/          # Contextos e providers
├── hooks/            # Hooks customizados
├── pages/            # Componentes de página
├── services/         # Serviços de API
├── styles/           # Estilos globais
├── types/            # Definições de tipos
└── utils/            # Funções utilitárias
```

## 🔒 Segurança

### Auth0
1. Configuração
   ```typescript
   const auth0Config = {
     domain: process.env.REACT_APP_AUTH0_DOMAIN,
     clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
     audience: process.env.REACT_APP_AUTH0_AUDIENCE,
     redirectUri: window.location.origin,
     scope: 'openid profile email'
   };
   ```

2. Proteção de Rotas
   ```typescript
   <Route
     path="/admin"
     element={
       <PrivateRoute roles={['admin']}>
         <AdminPage />
       </PrivateRoute>
     }
   />
   ```

### API
1. Interceptor de Token
   ```typescript
   api.interceptors.request.use(async (config) => {
     const token = await auth0.getTokenSilently();
     config.headers.Authorization = `Bearer ${token}`;
     return config;
   });
   ```

2. Tratamento de Erros
   ```typescript
   api.interceptors.response.use(
     (response) => response,
     async (error) => {
       if (error.response?.status === 401) {
         await auth0.logout();
       }
       return Promise.reject(error);
     }
   );
   ```

## 🎯 Performance

### Otimizações
1. Code Splitting
   ```typescript
   const AdminPage = lazy(() => import('./pages/AdminPage'));
   ```

2. Memoização
   ```typescript
   const MemoizedComponent = memo(Component);
   ```

3. Virtualização
   ```typescript
   <VirtualList
     height={400}
     itemCount={items.length}
     itemSize={50}
     width={300}
   >
     {Row}
   </VirtualList>
   ```

### Cache
1. React Query
   ```typescript
   const { data, isLoading } = useQuery('items', fetchItems, {
     staleTime: 5 * 60 * 1000,
     cacheTime: 30 * 60 * 1000
   });
   ```

2. Service Worker
   ```typescript
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/sw.js');
     });
   }
   ```

## 📊 Monitoramento

### Logging
```typescript
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};
```

### Métricas
1. Performance
   ```typescript
   const reportWebVitals = (metric: any) => {
     console.log(metric);
   };
   ```

2. Erros
   ```typescript
   window.onerror = (message, source, lineno, colno, error) => {
     logger.error('Global error:', {
       message,
       source,
       lineno,
       colno,
       error
     });
   };
   ```

## 🚀 Deploy

### Pipeline
1. Build
   ```yaml
   build:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v2
       - uses: actions/setup-node@v2
       - run: npm ci
       - run: npm run build
   ```

2. Testes
   ```yaml
   test:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v2
       - uses: actions/setup-node@v2
       - run: npm ci
       - run: npm run test
   ```

3. Deploy
   ```yaml
   deploy:
     needs: [build, test]
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v2
       - uses: azure/webapps-deploy@v2
   ```
