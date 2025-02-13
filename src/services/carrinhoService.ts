import api from './api';
import { Carrinho, Status } from '../types/index';

const CarrinhoService = {
  async getCarrinhos(): Promise<Carrinho[]> {
    const response = await api.get<Carrinho[]>('/Carrinho');
    return response.data;
  },

  async getCarrinho(id: number): Promise<Carrinho> {
    const response = await api.get<Carrinho>(`/Carrinho/${id}`);
    return response.data;
  },

  async createCarrinho(usuarioId: number): Promise<Carrinho> {
    const response = await api.post<Carrinho>('/Carrinho', {
      usuarioId: usuarioId,
      status: Status.EmAberto,
      dataCriacao: new Date().toISOString()
    });
    return response.data;
  },

  async updateCarrinho(id: number, carrinho: Partial<Carrinho>): Promise<void> {
    await api.put(`/Carrinho/${id}`, carrinho);
  },

  async updateCarrinhoStatus(id: number, status: Status): Promise<void> {
    await api.put(`/Carrinho/${id}`, { status });
  },

  async deleteCarrinho(id: number): Promise<void> {
    await api.delete(`/Carrinho/${id}`);
  }
};

export default CarrinhoService;
