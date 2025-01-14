import api from './api';
import { Carrinho } from '../types';

const CarrinhoService = {
  async getCarrinhos(): Promise<Carrinho[]> {
    const response = await api.get('/Carrinho');
    return response.data;
  },

  async createCarrinho(carrinho: Omit<Carrinho, 'id'>): Promise<Carrinho> {
    const response = await api.post('/Carrinho', carrinho);
    return response.data;
  },

  async updateCarrinho(id: number, carrinho: Partial<Carrinho>): Promise<void> {
    await api.put(`/Carrinho/${id}`, carrinho);
  },

  async deleteCarrinho(id: number): Promise<void> {
    await api.delete(`/Carrinho/${id}`);
  }
};

export default CarrinhoService;
