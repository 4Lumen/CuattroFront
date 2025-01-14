export interface Item {
  id: number;
  nome: string | null;
  descricao: string | null;
  preco: number;
  imagemUrl: string | null;
}

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
  'https://buffet-app.com/roles'?: number[];
}

export interface AuthConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
}
