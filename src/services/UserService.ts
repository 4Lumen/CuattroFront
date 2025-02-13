import api from './api';
import { Usuario, CreateUsuarioDto, Role } from '../types/index';

const UserService = {
  async createUser(userData: CreateUsuarioDto): Promise<Usuario> {
    const response = await api.post<Usuario>('/Usuario', userData);
    return response.data;
  },

  async getCurrentUser(): Promise<Usuario> {
    const response = await api.get<Usuario>('/Usuario');
    return response.data;
  },

  async updateUser(userData: Partial<Usuario>): Promise<void> {
    await api.put('/Usuario', userData);
  },

  async updateUserRole(id: number, role: Role): Promise<void> {
    await api.put(`/Usuario/role/${id}`, role);
  }
};

export default UserService;