# Contexto de Produtos

## 📦 Modelos

### Item
```typescript
interface Item {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  categoria: string;
}
```

### ItemCarrinho
```typescript
interface ItemCarrinho {
  id: number;
  carrinhoId: number;
  itemId: number;
  quantidade: number;
  item?: Item;
}
```

### Carrinho
```typescript
interface Carrinho {
  id: number;
  usuarioId: number;
  dataCriacao: string;
  status: number;
  itensCarrinho: ItemCarrinho[];
}
```

## 🔄 Serviços

### itemService
```typescript
const itemService = {
  getItems: async (): Promise<Item[]> => {
    const response = await api.get('/Item');
    return response.data;
  },

  getItemById: async (id: number): Promise<Item> => {
    const response = await api.get(`/Item/${id}`);
    return response.data;
  },

  createItem: async (item: Omit<Item, 'id'>): Promise<Item> => {
    const response = await api.post('/Item', item);
    return response.data;
  },

  updateItem: async (id: number, item: Partial<Item>): Promise<Item> => {
    const response = await api.put(`/Item/${id}`, item);
    return response.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await api.delete(`/Item/${id}`);
  },

  uploadImage: async (id: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/Item/${id}/imagem`, formData);
    return response.data.imagemUrl;
  }
};
```

### carrinhoService
```typescript
const carrinhoService = {
  getCarrinho: async (userId: number): Promise<Carrinho | null> => {
    try {
      const response = await api.get(`/Carrinho/usuario/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createCarrinho: async (carrinho: Omit<Carrinho, 'id'>): Promise<Carrinho> => {
    const response = await api.post('/Carrinho', carrinho);
    return response.data;
  },

  updateCarrinho: async (id: number, carrinho: Partial<Carrinho>): Promise<Carrinho> => {
    const response = await api.put(`/Carrinho/${id}`, carrinho);
    return response.data;
  },

  deleteCarrinho: async (id: number): Promise<void> => {
    await api.delete(`/Carrinho/${id}`);
  }
};
```

### itemCarrinhoService
```typescript
const itemCarrinhoService = {
  addItemToCart: async (item: Omit<ItemCarrinho, 'id'>): Promise<ItemCarrinho> => {
    const response = await api.post('/ItemCarrinho', item);
    return response.data;
  },

  updateCartItem: async (id: number, quantidade: number): Promise<ItemCarrinho> => {
    const response = await api.put(`/ItemCarrinho/${id}`, { quantidade });
    return response.data;
  },

  removeItemFromCart: async (id: number): Promise<void> => {
    await api.delete(`/ItemCarrinho/${id}`);
  }
};
```

## 🎯 Hooks

### useItems
```typescript
const useItems = () => {
  const { state, dispatch } = useAppContext();

  const fetchItems = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const items = await itemService.getItems();
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar itens' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getItemsByCategory = (categoria: string) => {
    return state.items.filter(item => item.categoria === categoria);
  };

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    fetchItems,
    getItemsByCategory
  };
};
```

## 🛒 Fluxo de Compra

1. Listagem de Produtos
   - Carrega itens do backend
   - Filtra por categoria
   - Exibe cards com imagem e preço

2. Adição ao Carrinho
   - Verifica autenticação
   - Adiciona item ao carrinho
   - Atualiza quantidade se já existe
   - Persiste no backend

3. Gerenciamento do Carrinho
   - Lista itens do carrinho
   - Permite alterar quantidade
   - Remove itens
   - Calcula total

4. Finalização da Compra
   - Confirma itens
   - Seleciona forma de pagamento
   - Processa pagamento
   - Gera pedido
