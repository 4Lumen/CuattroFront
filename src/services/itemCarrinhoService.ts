import api from './api';
import { ItemCarrinho } from '../types/index';

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

export default ItemCarrinhoService;
