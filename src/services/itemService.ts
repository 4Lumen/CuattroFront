import { AxiosError } from 'axios';
import api from './api';
import CategoriaService, { Categoria } from './categoriaService';

// Interface para criação de item (sem id)
export interface CreateItemDTO {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string | Categoria;
  categoriaId?: number;
  imagemUrl?: string;
  itensCarrinho?: ItemCarrinho[];
}

// Interface para item completo (com id)
export interface Item extends CreateItemDTO {
  id: number; // id é obrigatório para itens existentes
  categoriaId: number; // categoriaId é obrigatório para itens existentes
}

interface ItemCarrinho {
  id: number;
  quantidade: number;
  observacoes?: string;
}

const ItemService = {
  async getItems(): Promise<Item[]> {
    try {
      const response = await api.get('/Item', {
        params: {
          disponivel: true
        },
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

  async createItem(item: CreateItemDTO): Promise<Item> {
    try {
      console.log('Tentando criar item com dados:', item);

      // Validações locais antes de enviar ao servidor
      if (!item.nome) {
        throw new Error('O nome do item é obrigatório.');
      }
      if (item.nome.length > 100) {
        throw new Error('O nome do item não pode ter mais de 100 caracteres.');
      }
      if (item.descricao && item.descricao.length > 500) {
        throw new Error('A descrição não pode ter mais de 500 caracteres.');
      }
      if (!item.preco || item.preco <= 0) {
        throw new Error('O preço deve ser maior que zero.');
      }
      if (!item.categoria) {
        throw new Error('A categoria é obrigatória.');
      }

      let categoria;
      try {
        // Primeiro verifica/cria a categoria
        categoria = await this.getOrCreateCategoria(item.categoria);
        console.log('Categoria obtida/criada:', categoria);
      } catch (error) {
        console.error('Erro ao processar categoria:', error);
        if (error instanceof Error) {
          throw new Error(`Erro ao processar categoria: ${error.message}`);
        }
        throw new Error('Erro ao processar categoria. Por favor, contate o administrador.');
      }

      // Formata os dados para o formato esperado pelo backend
      const formattedData = {
        id: 0, // O backend irá gerar o ID real
        nome: item.nome.trim(),
        descricao: (item.descricao || '').trim(),
        preco: Number(item.preco),
        categoriaId: categoria.id,
        categoria: categoria, // Inclui o objeto categoria completo
        imagemUrl: (item.imagemUrl || '').trim(),
        itensCarrinho: []
      };

      console.log('Dados formatados para envio:', JSON.stringify(formattedData, null, 2));

      const response = await api.post('/Item', formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Resposta do servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      if (error instanceof Error) {
        // Se já é um erro tratado, repassa a mensagem
        throw error;
      }
      if (error instanceof AxiosError) {
        const requestData = error.config?.data ? JSON.parse(error.config.data) : null;
        const responseData = error.response?.data;
        
        console.error('Detalhes completos do erro:', {
          request: {
            method: error.config?.method,
            url: error.config?.url,
            data: requestData,
            headers: error.config?.headers
          },
          response: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: responseData,
            headers: error.response?.headers
          }
        });

        // Log específico para entender o formato da resposta
        console.error('Formato da resposta:', {
          responseType: typeof responseData,
          isNull: responseData === null,
          isObject: typeof responseData === 'object',
          hasType: responseData?.type,
          hasErrors: responseData?.errors,
          hasTitle: responseData?.title,
          fullResponse: JSON.stringify(responseData, null, 2),
          errors: responseData?.errors ? JSON.stringify(responseData.errors, null, 2) : undefined
        });

        if (error.response?.status === 401) {
          throw new Error('Você não tem permissão para criar itens.');
        }
        if (error.response?.status === 400) {
          // Formato específico de erro do ASP.NET Core
          if (responseData?.type?.includes('rfc9110#section-15.5.1')) {
            console.error('Erro de validação do ASP.NET Core:', {
              title: responseData.title,
              errors: responseData.errors,
              rawErrors: JSON.stringify(responseData.errors, null, 2)
            });
            
            if (responseData.errors) {
              const errorMessages = Object.entries(responseData.errors)
                .map(([field, messages]) => {
                  // Remove o prefixo '$.' e converte para formato mais amigável
                  const cleanField = field.replace(/^\$\./, '').replace(/([A-Z])/g, ' $1').toLowerCase();
                  return `${cleanField}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
                })
                .join('\n');
              throw new Error(`Por favor, corrija os seguintes erros:\n${errorMessages}`);
            }
            
            if (responseData.title) {
              throw new Error(`Erro de validação: ${responseData.title}`);
            }
          }

          // Outros tipos de erro 400
          if (typeof responseData === 'string') {
            throw new Error(`Erro do servidor: ${responseData}`);
          }

          // Se chegou aqui, tenta extrair alguma informação útil da resposta
          const errorMessage = responseData?.title || responseData?.message || 
            (typeof responseData === 'object' ? JSON.stringify(responseData) : 'Dados inválidos');
          throw new Error(`Erro do servidor: ${errorMessage}`);
        }
      }
      throw new Error('Erro ao criar item. Por favor, tente novamente.');
    }
  },

  // Type guards para verificar o tipo da categoria
  isCategoriaCompleta(categoria: any): categoria is Categoria {
    return (
      typeof categoria === 'object' &&
      categoria !== null &&
      'id' in categoria &&
      'nome' in categoria &&
      'descricao' in categoria &&
      'ordem' in categoria &&
      'ativa' in categoria
    );
  },

  isCategoriaSimples(categoria: any): categoria is { id: number; nome: string } {
    return (
      typeof categoria === 'object' &&
      categoria !== null &&
      'id' in categoria &&
      'nome' in categoria &&
      Object.keys(categoria).length === 2
    );
  },

  async updateItem(item: Item): Promise<Item> {
    console.log('Item para atualização:', item);
    console.log('Tipo da categoria:', typeof item.categoria, item.categoria);

    // Determina o ID da categoria
    let categoria: Categoria;
    if (typeof item.categoria === 'string') {
      try {
        categoria = await this.getOrCreateCategoria(item.categoria);
      } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        throw new Error('Erro ao processar categoria. Por favor, tente novamente.');
      }
    } else if (item.categoria) {
      categoria = item.categoria;
    } else {
      throw new Error('Categoria é obrigatória');
    }

    const itemData = {
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      preco: item.preco,
      imagemUrl: item.imagemUrl,
      categoriaId: categoria.id,
      categoria: categoria, // Envia o objeto categoria completo
      itensCarrinho: [] // Campo obrigatório para o backend
    };

    try {
      console.log('Dados formatados para envio:', itemData);
      const response = await api.put<Item>(`/Item/${item.id}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      if (error instanceof AxiosError) {
        const responseData = error.response?.data;
        console.error('Detalhes do erro:', {
          status: error.response?.status,
          data: responseData,
          headers: error.response?.headers
        });

        if (error.response?.status === 400) {
          if (typeof responseData === 'string') {
            throw new Error(`Erro de validação: ${responseData}`);
          }
          // Formato específico de erro do ASP.NET Core
          if (responseData?.type?.includes('rfc9110#section-15.5.1')) {
            if (responseData.errors) {
              const errorMessages = Object.entries(responseData.errors)
                .map(([field, messages]) => {
                  const cleanField = field.replace(/^\$\./, '').replace(/([A-Z])/g, ' $1').toLowerCase();
                  return `${cleanField}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
                })
                .join('\n');
              throw new Error(`Por favor, corrija os seguintes erros:\n${errorMessages}`);
            }
            
            if (responseData.title) {
              throw new Error(`Erro de validação: ${responseData.title}`);
            }
          }
        }
      }
      throw new Error('Erro ao atualizar item. Por favor, tente novamente.');
    }
  },

  async deleteItem(id: number): Promise<void> {
    try {
      await api.put(`/Item/${id}/disponibilidade`, false);
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
      // Validações conforme especificação
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use apenas JPG, PNG ou GIF.');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. O tamanho máximo permitido é 5MB.');
      }

      console.log('Iniciando upload de imagem:', {
        id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Cria o FormData com a imagem
      const formData = new FormData();
      formData.append('imagem', file);

      // Configura o upload com monitoramento de progresso
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progresso: ${percentCompleted}%`);
        }
      };

      // Faz o upload usando o endpoint correto conforme documentação
      const response = await api.post<{ imagemUrl: string }>(`/Item/${id}/imagem`, formData, config);

      if (response.data?.imagemUrl) {
        return response.data.imagemUrl;
      }

      throw new Error('URL da imagem não retornada pelo servidor');
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
            headers: error.config?.headers
          }
        });

        // Tratamento de erros conforme documentação
        if (error.response?.status === 400) {
          const errorMessage = error.response.data?.error || 'Erro de validação no upload da imagem';
          throw new Error(errorMessage);
        }
        if (error.response?.status === 401) {
          throw new Error('Token de autenticação inválido ou expirado.');
        }
        if (error.response?.status === 403) {
          throw new Error('Usuário não tem permissão para realizar esta operação.');
        }
        if (error.response?.status === 404) {
          throw new Error('Item não encontrado');
        }
        if (error.response?.status === 413) {
          throw new Error('Arquivo muito grande. O tamanho máximo permitido é 5MB.');
        }
      }
      
      // Se o erro já é uma instância de Error (como os de validação local), mantém a mensagem original
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Erro ao fazer upload da imagem. Por favor, tente novamente.');
    }
  },

  async getOrCreateCategoria(categoria: string | Categoria): Promise<Categoria> {
    if (typeof categoria === 'string') {
      return CategoriaService.getOrCreateCategoria(categoria);
    }
    return categoria;
  }
};

export default ItemService;