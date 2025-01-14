export interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export interface Item {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string | null;
  categoria: string;
}

export interface ItemCarrinho {
  id: number;
  carrinhoId: number;
  itemId: number;
  quantidade: number;
  item?: Item;
}

export interface Carrinho {
  id: number;
  userId: number;
  itensCarrinho?: ItemCarrinho[];
}

export interface AppState {
  user: User | null;
  cart: Carrinho | null;
  items: Item[];
}

export type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CART'; payload: Carrinho | null }
  | { type: 'ADD_TO_CART'; payload: { item: Item; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_ITEMS'; payload: Item[] }; 