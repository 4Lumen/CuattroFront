import axios from 'axios';
import AuthService from './authService';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 segundos
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
    if (!config.headers.Authorization) {
      try {
        const token = await AuthService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evita loop infinito
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

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

    // Trata erros de timeout
    if (error.code === 'ECONNABORTED') {
      const retryCount = originalRequest._retryCount || 0;
      if (retryCount < 3) {
        originalRequest._retryCount = retryCount + 1;
        return axios(originalRequest);
      }
      error.message = 'Não foi possível conectar ao servidor. Por favor, verifique sua conexão.';
    }

    return Promise.reject(error);
  }
);

export default api;

