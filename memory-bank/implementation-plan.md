# User and Cart Management Implementation Plan

## 1. Type Updates

### Update User Interface
```typescript
export interface Usuario {
  id: number;
  auth0Id?: string;
  nome?: string;
  email?: string;
  role: Role;
}

export interface CreateUsuarioDto {
  auth0Id?: string;
  nome?: string;
  email?: string;
}

export enum Role {
  Cliente = 0,
  Funcionario = 1,
  Administrador = 2
}
```

### Update Cart Related Types
```typescript
export interface Carrinho {
  id: number;
  usuarioId: number;
  usuario?: Usuario;
  dataCriacao: string;
  dataEntrega?: string;
  localEntrega?: string;
  status: Status;
  itensCarrinho?: ItemCarrinho[];
}

export interface ItemCarrinho {
  id: number;
  carrinhoId: number;
  carrinho?: Carrinho;
  itemId: number;
  item?: Item;
  quantidade: number;
}

export enum Status {
  EmAberto = 0,
  EmProcessamento = 1,
  Finalizado = 2,
  Cancelado = 3
}
```

## 2. Service Implementation

### Create UserService
```typescript
const UserService = {
  async createUser(userData: CreateUsuarioDto): Promise<Usuario> {
    const response = await api.post<Usuario>('/Usuario', userData);
    return response.data;
  },

  async getCurrentUser(): Promise<Usuario> {
    const response = await api.get<Usuario>('/Usuario');
    return response.data;
  },

  async updateUser(userData: Partial<Usuario>): Promise<void> {
    await api.put('/Usuario', userData);
  }
};
```

### Update CarrinhoService
```typescript
const CarrinhoService = {
  // Existing methods remain...

  async createCarrinho(carrinho: Omit<Carrinho, 'id'>): Promise<Carrinho> {
    const response = await api.post<Carrinho>('/Carrinho', {
      ...carrinho,
      status: Status.EmAberto,
      dataCriacao: new Date().toISOString()
    });
    return response.data;
  },

  async updateCarrinhoStatus(id: number, status: Status): Promise<void> {
    await api.put(`/Carrinho/${id}`, { status });
  }
};
```

### Update ItemCarrinhoService
```typescript
const ItemCarrinhoService = {
  async addItemToCart(itemCarrinho: Omit<ItemCarrinho, 'id'>): Promise<ItemCarrinho> {
    const response = await api.post<ItemCarrinho>('/ItemCarrinho', itemCarrinho);
    return response.data;
  },

  async updateItemQuantity(id: number, quantidade: number): Promise<void> {
    await api.put(`/ItemCarrinho/${id}`, { quantidade });
  },

  async removeItem(id: number): Promise<void> {
    await api.delete(`/ItemCarrinho/${id}`);
  }
};
```

## 3. Error Handling

Add proper error handling in the api service:

```typescript
// api.ts
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.detail || 'Invalid request');
        case 401:
          // Handle unauthorized
          break;
        case 404:
          throw new Error('Resource not found');
        default:
          throw new Error('An unexpected error occurred');
      }
    }
    throw error;
  }
);
```

## 4. Implementation Steps

1. Update types.ts with new interfaces and enums
2. Create new UserService.ts
3. Update existing CartService and ItemCarrinhoService
4. Add error handling to api.ts
5. Update components to use new service methods
6. Test all functionality

## 5. Validation Requirements

- Ensure proper error handling for all API calls
- Validate cart status transitions
- Check item availability before adding to cart
- Validate user permissions for operations
- Handle Auth0 integration properly

## 6. Security Considerations

- All endpoints require Bearer token authentication
- Implement proper role-based access control
- Validate all user inputs
- Handle sensitive data appropriately
- Ensure proper error messages don't expose sensitive information