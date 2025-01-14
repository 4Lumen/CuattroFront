# Padrões do Sistema - Cuattro

## Arquitetura

### Frontend
1. Componentes React
   - Funcionais com TypeScript
   - Props tipadas e documentadas
   - Hooks customizados para lógica
   - Testes unitários

2. Gerenciamento de Estado
   - Context API para estado global
   - Hooks para estado local
   - Reducers para lógica complexa

3. Roteamento
   - React Router v6
   - Lazy loading de rotas
   - Proteção por roles

### Backend
1. API REST
   - Controllers CRUD
   - DTOs para transferência
   - Validação de modelos
   - Documentação Swagger

2. Banco de Dados
   - Code First com EF Core
   - Migrations versionadas
   - Índices otimizados

3. Autenticação
   - JWT via Auth0
   - Refresh tokens
   - RBAC

## Padrões de Código

### Nomenclatura
1. Componentes
   ```typescript
   // PascalCase para componentes
   const UserProfile: React.FC<UserProfileProps> = () => {};
   
   // camelCase para hooks
   const useCart = () => {};
   
   // UPPER_CASE para constantes
   const API_URL = process.env.REACT_APP_API_URL;
   ```

2. Arquivos
   ```
   components/
   ├── UserProfile.tsx
   ├── OrderList.tsx
   └── CartItem.tsx
   ```

3. Estilos
   ```css
   /* Tailwind + BEM */
   .card {}
   .card__header {}
   .card__content {}
   ```

### Estrutura de Componentes
```typescript
// Imports
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface Props {
  data: Type;
  onAction: () => void;
}

// Component
const Component: React.FC<Props> = ({ data, onAction }) => {
  // Hooks
  const navigate = useNavigate();

  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handleClick = () => {};

  // Render
  return <div />;
};

export default Component;
```

## Padrões de API

### Endpoints
```typescript
// GET /api/items
// POST /api/items
// GET /api/items/{id}
// PUT /api/items/{id}
// DELETE /api/items/{id}
```

### Respostas
```typescript
// Sucesso
{
  success: true,
  data: T,
  message?: string
}

// Erro
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Padrões de Teste

### Unit Tests
```typescript
describe('Component', () => {
  it('should render correctly', () => {});
  it('should handle user interaction', () => {});
  it('should manage state properly', () => {});
});
```

### Integration Tests
```typescript
describe('API', () => {
  it('should create resource', async () => {});
  it('should retrieve resource', async () => {});
  it('should handle errors', async () => {});
});
```

## Padrões de Commit
```bash
# Tipos
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

## Padrões de Deploy

### Ambientes
1. Desenvolvimento
   - Branch: develop
   - URL: dev.cuattro.4lumen.com

2. Homologação
   - Branch: staging
   - URL: staging.cuattro.4lumen.com

3. Produção
   - Branch: main
   - URL: cuattro.4lumen.com

### Pipeline
1. Build
   - Lint
   - Testes
   - Build

2. Deploy
   - Backup
   - Migrations
   - Deploy
   - Smoke Tests
