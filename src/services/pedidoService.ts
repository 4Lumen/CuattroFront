import api from './api';
import { Item } from './itemService';
import { AxiosError } from 'axios';

export interface CartItem {
  item: Item;
  quantity: number;
}

export enum FormaPagamento {
  Dinheiro = 0,
  Cartao = 1,
  Pix = 2
}

export enum StatusPedido {
  Pendente = 0,
  EmPreparo = 1,
  Pronto = 2,
  Entregue = 3,
  Cancelado = 4
}

export interface ItemPedido {
  itemId: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Pedido {
  usuarioId: number;
  enderecoEntrega: string;
  formaPagamento: FormaPagamento;
  status: StatusPedido;
  itens: ItemPedido[];
  valorTotal: number;
}

const mapFormaPagamento = (formaPagamentoStr: string): FormaPagamento => {
  switch (formaPagamentoStr) {
    case 'Dinheiro':
      return FormaPagamento.Dinheiro;
    case 'Cartao':
      return FormaPagamento.Cartao;
    case 'Pix':
      return FormaPagamento.Pix;
    default:
      throw new Error('Forma de pagamento inválida');
  }
};

const PedidoService = {
  async createPedido(items: CartItem[], formaPagamentoStr: string, enderecoEntrega: string): Promise<void> {
    try {
      console.log('Iniciando criação do pedido...');
      
      const formaPagamento = mapFormaPagamento(formaPagamentoStr);
      
      const itensPedido: ItemPedido[] = items.map(({ item, quantity }) => ({
        itemId: item.id,
        quantidade: quantity,
        valorUnitario: item.preco,
        valorTotal: item.preco * quantity
      }));

      console.log('Itens formatados:', itensPedido);

      const valorTotal = items.reduce((total, { item, quantity }) => total + (item.preco * quantity), 0);

      // O usuário ID será obtido do token JWT pelo backend
      const pedido: Pedido = {
        usuarioId: 0, // O backend vai pegar do token
        enderecoEntrega,
        formaPagamento,
        status: StatusPedido.Pendente,
        itens: itensPedido,
        valorTotal
      };

      console.log('Dados do pedido:', pedido);

      await api.post('/Pedido', pedido);
      console.log('Pedido criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('Resposta da API:', error.response.data);
        throw new Error(error.response.data.message || 'Erro ao criar pedido');
      }
      throw error;
    }
  }
};

export default PedidoService; 