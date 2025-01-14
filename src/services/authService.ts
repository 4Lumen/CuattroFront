import { Auth0Client } from '@auth0/auth0-spa-js';
import { User, Auth0User } from '../types';

// Constantes para configuração
const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;
const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;

if (!AUTH0_AUDIENCE || !AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
  throw new Error('Configurações do Auth0 não encontradas no arquivo .env');
}

const auth0Config = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  audience: AUTH0_AUDIENCE,
  redirectUri: window.location.origin,
  scope: 'openid profile email offline_access'
};

console.log('Auth0 Config:', {
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
  audience: auth0Config.audience,
  redirectUri: auth0Config.redirectUri
});

const auth0 = new Auth0Client({
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
  authorizationParams: {
    redirect_uri: auth0Config.redirectUri,
    audience: auth0Config.audience,
    scope: auth0Config.scope
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage'
});

const AuthService = {
  async login(): Promise<void> {
    try {
      // Limpa qualquer estado anterior
      localStorage.removeItem('returnTo');
      
      // Salva a URL atual para redirecionamento após o login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.setItem('returnTo', currentPath);
      }

      console.log('Iniciando login com configurações:', {
        ...auth0Config,
        currentPath
      });

      await auth0.loginWithRedirect({
        authorizationParams: {
          redirect_uri: auth0Config.redirectUri,
          audience: auth0Config.audience,
          scope: auth0Config.scope
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await auth0.logout({
        logoutParams: {
          returnTo: auth0Config.redirectUri
        }
      });
      localStorage.removeItem('returnTo');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async handleRedirectCallback(): Promise<User | null> {
    try {
      // Se houver um erro na URL, retorna null
      if (window.location.search.includes('error=')) {
        console.error('Erro detectado na URL:', window.location.search);
        return null;
      }

      // Processa o callback
      await auth0.handleRedirectCallback();

      // Obtém o usuário autenticado
      const auth0User = await auth0.getUser<Auth0User>();
      if (!auth0User) {
        console.log('Nenhum usuário autenticado encontrado');
        return null;
      }

      // Mapeia o usuário do Auth0 para nosso modelo de usuário
      const user: User = {
        id: auth0User.sub,
        auth0Id: auth0User.sub,
        nome: auth0User.name || auth0User.nickname || '',
        email: auth0User.email || '',
        role: auth0User[`${auth0Config.audience}/roles`]?.[0] || 0,
        picture: auth0User.picture
      };

      console.log('Usuário mapeado:', user);
      return user;
    } catch (error) {
      console.error('Error handling redirect:', error);
      return null;
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      const isAuthenticated = await auth0.isAuthenticated();
      if (!isAuthenticated) {
        return null;
      }

      const token = await auth0.getTokenSilently({
        authorizationParams: {
          audience: auth0Config.audience,
          scope: auth0Config.scope
        }
      });
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await auth0.getUser();
      return !!user;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
};

export default AuthService;
