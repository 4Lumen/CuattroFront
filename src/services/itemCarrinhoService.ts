import api from './api';
import { ItemCarrinho } from '../types';

const ItemCarrinhoService = {
  async addItemToCart(itemCarrinho: Omit<ItemCarrinho, 'id'>): Promise<ItemCarrinho> {
    const response = await api.post<ItemCarrinho>('/ItemCarrinho', itemCarrinho);
    return response.data;
  },

  async updateCartItem(id: number, itemCarrinho: Partial<ItemCarrinho>): Promise<ItemCarrinho> {
    const response = await api.put<ItemCarrinho>(`/ItemCarrinho/${id}`, itemCarrinho);
    return response.data;
  },

  async removeItemFromCart(carrinhoId: number, itemId: number): Promise<void> {
    await api.delete(`/ItemCarrinho/${carrinhoId}/${itemId}`);
  }
};

export default ItemCarrinhoService;
