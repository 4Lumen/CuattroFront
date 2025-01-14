import api from './api';

import { Item } from '../types';

const ItemService = {
  async getItems(): Promise<Item[]> {
    const response = await api.get('/Item');
    return response.data;
  },

  async getItem(id: number): Promise<Item> {
    const response = await api.get(`/Item/${id}`);
    return response.data;
  },

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    const response = await api.post('/Item', item);
    return response.data;
  },

  async uploadImage(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/Item/${id}/imagem`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default ItemService;
