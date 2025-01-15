import { Item } from './services/itemService';

export interface Carrinho {
  id: number;
  usuarioId: string;
  dataCriacao: string;
  dataEntrega?: string;
  localEntrega?: string;
  status: Status;
  itensCarrinho?: ItemCarrinho[];
}

export interface ItemCarrinho {
  id: number;
  carrinhoId: number;
  itemId: number;
  quantidade: number;
  item?: Item;
}

export enum Status {
  Pendente = 0,
  Preparando = 1,
  Pronto = 2,
  Entregue = 3
}

export enum Role {
  Cliente = 0,
  Funcionario = 1,
  Admin = 2
}

export interface User {
  id: string;
  auth0Id: string;
  nome: string | null;
  email: string | null;
  role: Role;
  picture?: string;
}

export interface Auth0User {
  sub: string;
  name?: string;
  nickname?: string;
  email?: string;
  picture?: string;
  'https://api.cuattro.4lumen.com/roles'?: string[] | number[];
  'https://api.cuattro.4lumen.com/role'?: string | number;
  roles?: string[] | number[];
  role?: string | number;
  app_metadata?: {
    role?: string | number;
    roles?: string[] | number[];
  };
  user_metadata?: {
    role?: string | number;
    roles?: string[] | number[];
  };
  [key: string]: any;
}

export interface AuthConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
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
  | { type: 'ADD_TO_CART'; payload: { item: Item; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
