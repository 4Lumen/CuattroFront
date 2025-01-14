import api from './api';
import { Item } from '../types';
import { AxiosError } from 'axios';

const ItemService = {
  async getItems(): Promise<Item[]> {
    try {
      const response = await api.get('/Item', {
        timeout: 15000 // 15 segundos
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching items:', error);
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Não foi possível conectar ao servidor. Por favor, verifique sua conexão.');
        }
        if (error.response?.status === 401) {
          throw new Error('Você não tem permissão para acessar estes itens.');
        }
      }
      throw new Error('Erro ao carregar itens. Por favor, tente novamente.');
    }
  },

  async getItem(id: number): Promise<Item> {
    try {
      const response = await api.get(`/Item/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item:', error);
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new Error('Item não encontrado.');
      }
      throw new Error('Erro ao carregar item. Por favor, tente novamente.');
    }
  },

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    try {
      console.log('Tentando criar item com dados:', item);
      
      // Validação adicional dos dados
      if (!item.nome || item.nome.trim() === '') {
        throw new Error('O nome do item é obrigatório');
      }
      if (!item.categoria || item.categoria.trim() === '') {
        throw new Error('A categoria do item é obrigatória');
      }
      if (typeof item.preco !== 'number' || item.preco <= 0) {
        throw new Error('O preço do item deve ser um número positivo');
      }

      // Formata os dados conforme esperado pelo backend
      const itemData = {
        id: 0, // O backend espera este campo mesmo para criação
        nome: item.nome.trim(),
        descricao: item.descricao?.trim() || null, // Deve ser null se vazio
        preco: Number(item.preco.toFixed(2)), // Garante 2 casas decimais
        categoria: item.categoria.trim(),
        imagemUrl: item.imagemUrl || '', // Garante que seja string vazia se não houver imagem
        itensCarrinho: [] // Backend exige este campo
      };

      console.log('Dados formatados para envio:', itemData);

      const response = await api.post('/Item', itemData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Resposta da criação do item:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      if (error instanceof AxiosError) {
        console.error('Detalhes do erro:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          request: {
            method: error.config?.method,
            url: error.config?.url,
            data: error.config?.data,
            headers: error.config?.headers
          }
        });

        if (error.response?.status === 401) {
          throw new Error('Você não tem permissão para criar itens.');
        }
        if (error.response?.status === 400) {
          const errorData = error.response.data;
          if (errorData.errors) {
            const errorMessages = Object.entries(errorData.errors)
              .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
              .join('\n');
            throw new Error(`Erros de validação:\n${errorMessages}`);
          }
          throw new Error(errorData.title || 'Dados inválidos. Por favor, verifique as informações.');
        }
      }
      throw error instanceof Error ? error : new Error('Erro ao criar item. Por favor, tente novamente.');
    }
  },

  async updateItem(item: Item): Promise<Item> {
    try {
      // Envia apenas os campos necessários para atualização
      const updateData = {
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        categoria: item.categoria,
        imagemUrl: item.imagemUrl,
        itensCarrinho: [] // Backend exige este campo
      };

      console.log('Dados para atualização:', updateData);

      // Usa o endpoint correto com ID na URL
      const response = await api.put(`/Item/${item.id}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta da atualização do item:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      if (error instanceof AxiosError) {
        console.error('Detalhes do erro:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          request: {
            method: error.config?.method,
            url: error.config?.url,
            data: error.config?.data,
            headers: error.config?.headers
          }
        });
        
        if (error.response?.status === 401) {
          throw new Error('Você não tem permissão para atualizar itens.');
        }
        if (error.response?.status === 404) {
          throw new Error('Item não encontrado.');
        }
        if (error.response?.status === 405) {
          throw new Error('Operação não permitida. Por favor, contate o suporte.');
        }
      }
      throw new Error('Erro ao atualizar item. Por favor, tente novamente.');
    }
  },

  async deleteItem(id: number): Promise<void> {
    try {
      await api.delete(`/Item/${id}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Você não tem permissão para excluir itens.');
        }
        if (error.response?.status === 404) {
          throw new Error('Item não encontrado.');
        }
      }
      throw new Error('Erro ao excluir item. Por favor, tente novamente.');
    }
  },

  async uploadImage(id: number, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Iniciando upload de imagem:', {
        id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        formData: Array.from(formData.entries())
      });

      // Primeiro, vamos verificar se o bucket existe
      try {
        const bucketResponse = await api.get('/Item/bucket-info');
        console.log('Informações do bucket:', bucketResponse.data);
      } catch (bucketError) {
        console.warn('Não foi possível verificar o bucket:', bucketError);
      }

      // Tenta fazer o upload diretamente para o endpoint de imagem
      const response = await api.post(`/Item/${id}/imagem`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 60000, // 60 segundos
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size));
          console.log(`Upload progresso: ${percentCompleted}%`);
        }
      });

      console.log('Resposta completa do upload:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      if (!response.data || !response.data.imagemUrl) {
        console.error('Resposta do upload sem URL:', response.data);
        throw new Error('URL da imagem não retornada pelo servidor.');
      }

      // Retorna a URL imediatamente após o upload
      return response.data.imagemUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof AxiosError) {
        console.error('Detalhes do erro de upload:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          request: {
            method: error.config?.method,
            url: error.config?.url,
            headers: error.config?.headers,
            baseURL: error.config?.baseURL
          }
        });

        if (error.code === 'ECONNABORTED') {
          throw new Error('O upload da imagem demorou muito. Por favor, tente novamente.');
        }
        if (error.response?.status === 401) {
          throw new Error('Você não tem permissão para fazer upload de imagens.');
        }
        if (error.response?.status === 413) {
          throw new Error('A imagem é muito grande. Por favor, use uma imagem menor.');
        }
        if (error.response?.status === 404) {
          throw new Error('Endpoint de upload não encontrado. Por favor, contate o suporte.');
        }
        if (error.response?.status === 500) {
          throw new Error('Erro no servidor ao processar a imagem. Por favor, tente novamente.');
        }
      }
      throw error instanceof Error ? error : new Error('Erro ao fazer upload da imagem. Por favor, tente novamente.');
    }
  },

  async updateImageUrl(id: number, imagemUrl: string): Promise<Item> {
    try {
      console.log('Atualizando URL da imagem:', { id, imagemUrl });

      const response = await api.post(`/Item/${id}/update-image`, { imagemUrl }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Resposta da atualização da URL:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating image URL:', error);
      if (error instanceof AxiosError) {
        console.error('Detalhes do erro:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          request: {
            method: error.config?.method,
            url: error.config?.url,
            data: error.config?.data,
            headers: error.config?.headers
          }
        });
        
        if (error.response?.status === 401) {
          throw new Error('Você não tem permissão para atualizar itens.');
        }
        if (error.response?.status === 404) {
          throw new Error('Item não encontrado.');
        }
        if (error.response?.status === 405) {
          throw new Error('Operação não permitida. Por favor, contate o suporte.');
        }
      }
      throw new Error('Erro ao atualizar URL da imagem. Por favor, tente novamente.');
    }
  }
};

export default ItemService;
