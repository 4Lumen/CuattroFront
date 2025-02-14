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
  unidadeMedida: string;
  quantidade: number;
  categoria: Categoria | { id: number; nome: string } | string;
  imagemUrl: string;
  disponivel: boolean;
  destaque: boolean;
  ordem: number;
  tags: string[];
  categoriaId: number;
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

export interface AppState {
  user: Usuario | null;
  cart: Carrinho | null;
  items: Item[];
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_USER'; payload: Usuario | null }
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

export enum Status {
  EmAberto = 0,
  EmProcessamento = 1,
  Finalizado = 2,
  Cancelado = 3
}

export type CarrinhoStatus = 0 | 1 | 2 | 3; // 0: Aberto, 1: Fechado, 2: Cancelado, 3: Finalizado