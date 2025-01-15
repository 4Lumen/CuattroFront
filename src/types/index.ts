export interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  auth0Id?: string;
  picture?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  ordem: number;
  ativa: boolean;
}

export interface Item {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: Categoria | { id: number; nome: string } | string;
  imagemUrl: string;
  itensCarrinho?: ItemCarrinho[];
}

export interface ItemCarrinho {
  id: number;
  quantidade: number;
  item: Item;
  carrinhoId: number;
}

export interface Carrinho {
  id: number;
  usuarioId: string;
  dataCriacao: string;
  status: CarrinhoStatus;
  itensCarrinho: ItemCarrinho[];
}

export interface AppState {
  user: User | null;
  cart: Carrinho | null;
  items: Item[];
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CART'; payload: Carrinho | null }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_TO_CART'; payload: ItemCarrinho }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface CartItem {
  id: number;
  carrinhoId: number;
  itemId: number;
  quantidade: number;
  item?: Item;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ImageUploadResponse {
  success: boolean;
  imagemUrl: string;
  error?: string;
}

export interface Auth0User {
  sub: string;
  name?: string;
  nickname?: string;
  email: string;
  picture?: string;
  [key: string]: any;
}

export type ItemStatus = 0 | 1 | 2; // 0: Ativo, 1: Inativo, 2: Esgotado

export type CarrinhoStatus = 0 | 1 | 2 | 3; // 0: Aberto, 1: Fechado, 2: Cancelado, 3: Finalizado 