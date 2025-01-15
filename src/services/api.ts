import axios from 'axios';
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
  async (error) => {
    // Se não houver resposta, pode ser um erro de rede
    if (!error.response) {
      console.error('Erro de rede ou servidor indisponível:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
      throw new Error('Erro de conexão com o servidor. Por favor, verifique sua conexão.');
    }

    console.error('Erro na resposta:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    const originalRequest = error.config;

    // Evita loop infinito
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Trata erro de autorização
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          if (originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }

      if (originalRequest) {
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const token = await AuthService.getAccessToken();
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            processQueue(null, token);
            return axios(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          await AuthService.login();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Trata erros de timeout
    if (error.code === 'ECONNABORTED' && originalRequest) {
      const retryCount = originalRequest._retryCount || 0;
      if (retryCount < 3) {
        originalRequest._retryCount = retryCount + 1;
        return axios(originalRequest);
      }
      error.message = 'Não foi possível conectar ao servidor. Por favor, verifique sua conexão.';
    }

    // Trata erro de permissão
    if (error.response?.status === 403) {
      console.error('Erro de permissão:', {
        token: error.config?.headers?.Authorization ? 'Present' : 'Missing',
        roles: {
          'X-User-Role': error.config?.headers?.['X-User-Role'],
          'X-User-Role-Name': error.config?.headers?.['X-User-Role-Name'],
          'X-Auth0-Role': error.config?.headers?.['X-Auth0-Role'],
          'X-Auth0-Roles': error.config?.headers?.['X-Auth0-Roles'],
          'X-Authorization-Policy': error.config?.headers?.['X-Authorization-Policy']
        },
        url: error.config?.url,
        method: error.config?.method
      });
      error.message = 'Você não tem permissão para realizar esta operação.';
    }

    return Promise.reject(error);
  }
);

export default api;

