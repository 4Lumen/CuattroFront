import api from './api';
import { AxiosError } from 'axios';

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ordem: number;
  ativa: boolean;
}

const CategoriaService = {
  async getCategorias(): Promise<Categoria[]> {
    try {
      console.log('Buscando categorias existentes...');
      const response = await api.get('/Categoria', {
        params: {
          ativa: true
        }
      });
      console.log('Categorias encontradas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categorias:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          throw new Error('Você não tem permissão para acessar as categorias. Por favor, contate o administrador.');
        }
        if (error.response?.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
        if (error.response?.status === 404) {
          console.warn('Nenhuma categoria encontrada');
          return [];
        }
      }
      console.warn('Retornando array vazio devido a erro');
      return [];
    }
  },

  async createCategoria(nome: string): Promise<Categoria> {
    try {
      console.log('Tentando criar categoria:', nome);
      const data = {
        nome,
        descricao: `Categoria ${nome}`,
        ordem: 0,
        ativa: true
      };

      const response = await api.post('/Categoria', data);
      console.log('Categoria criada com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating categoria:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          throw new Error('Você não tem permissão para criar categorias. Por favor, contate o administrador.');
        }
        if (error.response?.status === 400) {
          throw new Error('Dados da categoria inválidos. Por favor, verifique as informações.');
        }
      }
      throw new Error('Erro ao criar categoria. Por favor, contate o administrador.');
    }
  },

  async getOrCreateCategoria(nome: string): Promise<Categoria> {
    try {
      console.log('Procurando categoria:', nome);
      
      // Primeiro tenta buscar todas as categorias
      const categorias = await this.getCategorias();
      
      // Procura uma categoria com o mesmo nome (case insensitive)
      const existingCategoria = categorias.find(
        cat => cat.nome.toLowerCase() === nome.toLowerCase()
      );

      if (existingCategoria) {
        console.log('Categoria encontrada:', existingCategoria);
        return existingCategoria;
      }

      console.log('Categoria não encontrada, tentando criar...');
      // Se não encontrou, tenta criar uma nova
      return await this.createCategoria(nome);
    } catch (error) {
      console.error('Error getting or creating categoria:', error);
      if (error instanceof Error) {
        // Repassa o erro com a mensagem mais específica
        throw error;
      }
      throw new Error('Erro ao processar categoria. Por favor, contate o administrador.');
    }
  }
};

export default CategoriaService; 