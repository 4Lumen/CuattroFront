import api from './api';

interface ItemCarrinho {
  id: number;
  carrinhoId: number;
  itemId: number;
  quantidade: number;
}

const ItemCarrinhoService = {
  async addItemToCart(itemCarrinho: Omit<ItemCarrinho, 'id'>): Promise<ItemCarrinho> {
    const response = await api.post('/ItemCarrinho', itemCarrinho);
    return response.data;
  },

  async updateCartItem(id: number, itemCarrinho: Partial<ItemCarrinho>): Promise<void> {
    await api.put(`/ItemCarrinho/${id}`, itemCarrinho);
  }
};

export default ItemCarrinhoService;
