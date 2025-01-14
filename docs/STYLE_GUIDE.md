# Guia de Estilo - Buffet App

## 📝 Convenções de Código

### Nomenclatura

#### Componentes
- Use PascalCase para nomes de componentes
- Sufixo `Page` para páginas
- Sufixo `Provider` para contextos
```typescript
// ✅ Correto
const MenuItem: React.FC = () => {};
const CustomerPage: React.FC = () => {};
const CartProvider: React.FC = () => {};

// ❌ Incorreto
const menuItem = () => {};
const customer_page = () => {};
```

#### Hooks
- Prefixo `use`
- camelCase
```typescript
// ✅ Correto
const useCart = () => {};
const useLocalStorage = () => {};

// ❌ Incorreto
const CartHook = () => {};
const use_local_storage = () => {};
```

#### Interfaces e Types
- Prefixo `I` não é necessário
- Use PascalCase
```typescript
// ✅ Correto
interface MenuItem {};
type CartAction = {};

// ❌ Incorreto
interface IMenuItem {};
type cartAction = {};
```

### Organização de Arquivos

#### Estrutura de Diretórios
```
src/
├── components/
│   ├── MenuItem/
│   │   ├── index.tsx
│   │   ├── styles.ts
│   │   └── types.ts
│   └── MenuFilter/
├── hooks/
│   └── useCart.ts
└── pages/
    └── CustomerPage.tsx
```

#### Imports
- Agrupe imports por tipo
- Ordem: React, bibliotecas externas, componentes, hooks, utils
```typescript
// React
import React, { useEffect, useState } from 'react';

// Bibliotecas externas
import { Grid, Typography } from '@mui/material';

// Componentes
import MenuItem from '../components/MenuItem';

// Hooks
import { useCart } from '../hooks/useCart';

// Utils
import { formatPrice } from '../utils/format';
```

### Estilização

#### Tailwind CSS
- Use classes utilitárias do Tailwind quando possível
- Combine com styled-components para estilos complexos
```tsx
// ✅ Correto
<div className="flex items-center justify-between p-4">
  <Typography>Título</Typography>
</div>

// ❌ Incorreto
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
  <Typography>Título</Typography>
</div>
```

#### Material-UI
- Use o sistema de tema para customizações
- Evite estilos inline
```tsx
// ✅ Correto
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px'
        }
      }
    }
  }
});

// ❌ Incorreto
<Button sx={{ borderRadius: '8px' }}>
```

### TypeScript

#### Props
- Defina interfaces para props
- Use tipos específicos ao invés de `any`
```typescript
// ✅ Correto
interface MenuItemProps {
  item: Item;
  onAdd: (id: number) => void;
}

// ❌ Incorreto
interface MenuItemProps {
  item: any;
  onAdd: Function;
}
```

#### Enums
- Use para valores fixos
- PascalCase para nomes
```typescript
// ✅ Correto
enum OrderStatus {
  Pending,
  Processing,
  Completed
}

// ❌ Incorreto
const orderStatus = {
  PENDING: 0,
  PROCESSING: 1,
  COMPLETED: 2
};
```

### Estado e Side Effects

#### useEffect
- Sempre defina dependências
- Use funções de cleanup quando necessário
```typescript
// ✅ Correto
useEffect(() => {
  const subscription = api.subscribe(data);
  return () => subscription.unsubscribe();
}, [api]);

// ❌ Incorreto
useEffect(() => {
  api.subscribe(data);
}, []); // dependências faltando
```

#### Estado Global
- Use Context API para estado compartilhado
- Mantenha estado local quando possível
```typescript
// ✅ Correto
const [isOpen, setIsOpen] = useState(false); // estado local
const { cart, updateCart } = useCart(); // estado global

// ❌ Incorreto
const { isOpen, setIsOpen } = useGlobalState(); // estado local no contexto global
```

### Tratamento de Erros

#### Try/Catch
- Use async/await com try/catch
- Trate erros específicos
```typescript
// ✅ Correto
try {
  await api.request();
} catch (error) {
  if (error instanceof ApiError) {
    handleApiError(error);
  } else {
    handleGenericError(error);
  }
}

// ❌ Incorreto
try {
  await api.request();
} catch (error: any) {
  console.error(error);
}
```

### Comentários

#### Documentação
- Use JSDoc para funções públicas
- Mantenha comentários atualizados
```typescript
// ✅ Correto
/**
 * Adiciona um item ao carrinho
 * @param {Item} item - Item a ser adicionado
 * @param {number} quantity - Quantidade do item
 * @returns {Promise<void>}
 */
const addToCart = async (item: Item, quantity: number): Promise<void> => {
  // implementação
};

// ❌ Incorreto
// Adiciona ao carrinho
const addToCart = (item: any, quantity: any) => {
  // implementação
};
```

### Testes

#### Nomenclatura
- Descreva o comportamento esperado
- Use termos claros e específicos
```typescript
// ✅ Correto
describe('MenuItem', () => {
  it('should increment quantity when add button is clicked', () => {
    // teste
  });
});

// ❌ Incorreto
describe('MenuItem', () => {
  it('test add', () => {
    // teste
  });
});
```

### Git

#### Commits
- Use commits semânticos
- Mantenha commits pequenos e focados
```bash
# ✅ Correto
git commit -m "feat: adiciona funcionalidade de filtro por categoria"
git commit -m "fix: corrige cálculo do total do carrinho"

# ❌ Incorreto
git commit -m "updates"
git commit -m "wip"
```

#### Branches
- Use prefixos descritivos
- Inclua o número da issue quando aplicável
```bash
# ✅ Correto
feature/add-cart-functionality
fix/issue-123-cart-total

# ❌ Incorreto
new-feature
bugfix
``` 