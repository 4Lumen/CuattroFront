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
      if (error instanceof AxiosError && error.code === 'ECONNABORTED') {
        throw new Error('Não foi possível conectar ao servidor. Por favor, verifique sua conexão.');
      }
      throw error;
    }
  },

  async getItem(id: number): Promise<Item> {
    try {
      const response = await api.get(`/Item/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    try {
      const response = await api.post('/Item', item);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  async updateItem(item: Item): Promise<Item> {
    try {
      const response = await api.put(`/Item/${item.id}`, item);
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  async deleteItem(id: number): Promise<void> {
    try {
      await api.delete(`/Item/${id}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  async uploadImage(id: number, file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/Item/${id}/imagem`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 segundos para upload de imagens
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default ItemService;
