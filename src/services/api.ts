import axios, { AxiosError } from 'axios';
import AuthService from './authService';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000,
  timeoutErrorMessage: 'Tempo limite excedido. Por favor, tente novamente.'
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  async (config) => {
    console.log('Iniciando interceptor de request...');
    
    if (!config.headers.Authorization) {
      try {
        const token = await AuthService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Token adicionado ao header Authorization');
        }
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    }

    // Adiciona o role atual do usuário em múltiplos formatos no header
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser?.role !== undefined) {
        // Obtém o token para extrair as claims
        const token = await AuthService.getAccessToken();
        if (token) {
          // Decodifica o token para obter as claims
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            
            // Adiciona as claims originais do token nos headers
            if (payload['https://api.cuattro.4lumen.com/role']) {
              config.headers['X-Auth0-Role'] = payload['https://api.cuattro.4lumen.com/role'].toString();
            }
            if (payload['https://api.cuattro.4lumen.com/roles']) {
              config.headers['X-Auth0-Roles'] = JSON.stringify(payload['https://api.cuattro.4lumen.com/roles']);
            }
            
            // Adiciona também o role do usuário atual como fallback
            config.headers['X-User-Role'] = currentUser.role.toString();
            
            // Formato string baseado no valor numérico
            const roleMap = {
              0: 'Cliente',
              1: 'Funcionario',
              2: 'Admin'
            };
            const roleName = roleMap[currentUser.role as keyof typeof roleMap];
            config.headers['X-User-Role-Name'] = roleName;
            
            // Adiciona o nome da política para autorização
            config.headers['X-Authorization-Policy'] = roleName;
            
            console.log('Headers de autorização:', {
              token: typeof config.headers.Authorization === 'string' 
                ? config.headers.Authorization.substring(0, 20) + '...'
                : config.headers.Authorization,
              roleHeaders: {
                'X-User-Role': config.headers['X-User-Role'],
                'X-User-Role-Name': config.headers['X-User-Role-Name'],
                'X-Auth0-Role': config.headers['X-Auth0-Role'],
                'X-Auth0-Roles': config.headers['X-Auth0-Roles'],
                'X-Authorization-Policy': config.headers['X-Authorization-Policy'],
                'token_claims': {
                  role: payload['https://api.cuattro.4lumen.com/role'],
                  roles: payload['https://api.cuattro.4lumen.com/roles']
                }
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error getting current user role:', error);
    }

    return config;
  },
  (error) => {
    console.error('Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error((data as any).detail || 'Invalid request');
        case 401:
          // Handle unauthorized
          break;
        case 404:
          throw new Error('Resource not found');
        default:
          throw new Error('An unexpected error occurred');
      }
    }
    throw error;
  }
);

export default api;

