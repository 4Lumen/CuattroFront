import { Auth0Client } from '@auth0/auth0-spa-js';
import { User, Auth0User, Role } from '../types';

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
  scope: 'openid profile email offline_access roles permissions'
};

console.log('Auth0 Config:', auth0Config);

const auth0 = new Auth0Client({
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
  authorizationParams: {
    redirect_uri: auth0Config.redirectUri,
    audience: auth0Config.audience,
    scope: auth0Config.scope
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage',
  useRefreshTokensFallback: true
});

const AuthService = {
  async checkSession(): Promise<void> {
    try {
      console.log('Verificando sessão...');
      await auth0.checkSession();
      console.log('Sessão verificada com sucesso');
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      throw error;
    }
  },

  async login(): Promise<void> {
    try {
      // Limpa qualquer estado anterior
      localStorage.removeItem('returnTo');
      
      // Salva a URL atual para redirecionamento após o login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.setItem('returnTo', currentPath);
      }

      console.log('Iniciando processo de login...');

      // Tenta verificar a sessão primeiro
      try {
        await this.checkSession();
      } catch (error) {
        console.log('Sessão não encontrada, iniciando novo login');
      }

      // Inicia o processo de login
      await auth0.loginWithRedirect({
        authorizationParams: {
          redirect_uri: auth0Config.redirectUri,
          audience: auth0Config.audience,
          scope: auth0Config.scope
        },
        appState: { 
          returnTo: currentPath
        }
      });
    } catch (error) {
      console.error('Erro durante o login:', error);
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
      console.log('Processando callback de autenticação...');
      
      // Verifica se estamos em um callback de autenticação
      if (window.location.search.includes('code=') && 
          window.location.search.includes('state=')) {
        console.log('Detectado código de autorização na URL');
        
        // Processa o callback e obtém o resultado
        const result = await auth0.handleRedirectCallback();
        console.log('Callback processado:', result);

        // Obtém o token imediatamente após o callback
        const token = await auth0.getTokenSilently({
          authorizationParams: {
            audience: auth0Config.audience,
            scope: auth0Config.scope
          },
          detailedResponse: true
        });
        console.log('Token obtido após callback:', { hasToken: !!token });

        // Obtém os dados do usuário
        const auth0User = await auth0.getUser<Auth0User>();
        console.log('Dados do usuário obtidos:', auth0User);

        if (!auth0User) {
          console.log('Nenhum dado de usuário encontrado após callback');
          return null;
        }

        // Mapeia o usuário
        const user: User = {
          id: auth0User.sub,
          auth0Id: auth0User.sub,
          nome: auth0User.name || auth0User.nickname || '',
          email: auth0User.email || '',
          role: this.getRoleFromAuth0User(auth0User),
          picture: auth0User.picture
        };

        console.log('Usuário mapeado com sucesso após callback:', user);
        return user;
      }

      return null;
    } catch (error) {
      console.error('Erro ao processar callback:', error);
      return null;
    }
  },

  getAccessToken: async (): Promise<string> => {
    try {
      console.log('Tentando obter access token...');
      
      // Verifica se está autenticado primeiro
      const isAuthenticated = await auth0.isAuthenticated();
      if (!isAuthenticated) {
        console.log('Usuário não está autenticado ao tentar obter token');
        throw new Error('Usuário não autenticado');
      }

      // Tenta obter o token
      const token = await auth0.getTokenSilently({
        authorizationParams: {
          audience: auth0Config.audience,
          scope: auth0Config.scope
        },
        detailedResponse: true,
        timeoutInSeconds: 60
      });
      
      console.log('Token obtido com sucesso');
      return token.access_token;
    } catch (error) {
      console.error('Erro ao obter access token:', error);
      throw error;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const authenticated = await auth0.isAuthenticated();
      if (!authenticated) {
        return false;
      }

      // Não vamos mais verificar o token aqui para evitar loops
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('Iniciando verificação de usuário atual...');

      // Verifica autenticação
      const isAuthenticated = await auth0.isAuthenticated();
      console.log('Status de autenticação:', { isAuthenticated });
      
      if (!isAuthenticated) {
        console.log('Usuário não está autenticado');
        return null;
      }

      // Obtém e loga o token decodificado
      try {
        const token = await auth0.getTokenSilently({
          authorizationParams: {
            audience: auth0Config.audience,
            scope: auth0Config.scope
          },
          detailedResponse: true
        });
        console.log('Token obtido:', {
          access_token: token.access_token.substring(0, 20) + '...',
          scope: token.scope,
          expires_in: token.expires_in
        });

        // Decodifica o token
        const parts = token.access_token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log('Token payload decodificado:', payload);
          
          // Verifica se há claims de roles no token
          const rolesClaims = {
            [`${auth0Config.audience}/roles`]: payload[`${auth0Config.audience}/roles`],
            [`${auth0Config.audience}/role`]: payload[`${auth0Config.audience}/role`],
            'https://api.cuattro.4lumen.com/roles': payload['https://api.cuattro.4lumen.com/roles'],
            'https://api.cuattro.4lumen.com/role': payload['https://api.cuattro.4lumen.com/role'],
            roles: payload.roles,
            role: payload.role
          };
          console.log('Claims de roles encontradas no token:', rolesClaims);
        } else {
          console.log('Token não está no formato esperado JWT (header.payload.signature)');
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }

      // Se chegou aqui, está autenticado. Obtém os dados do usuário
      const auth0User = await auth0.getUser<Auth0User>();
      console.log('Dados do usuário Auth0:', auth0User);
      
      if (!auth0User) {
        console.log('Nenhum dado de usuário encontrado');
        return null;
      }

      // Mapeia o usuário
      const user: User = {
        id: auth0User.sub,
        auth0Id: auth0User.sub,
        nome: auth0User.name || auth0User.nickname || '',
        email: auth0User.email || '',
        role: this.getRoleFromAuth0User(auth0User),
        picture: auth0User.picture
      };

      console.log('Usuário atual obtido com sucesso:', user);
      return user;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  getRoleFromAuth0User(auth0User: Auth0User): Role {
    console.log('Auth0 User completo:', auth0User);
    console.log('Auth0 User metadata:', {
      app_metadata: auth0User.app_metadata,
      user_metadata: auth0User.user_metadata
    });
    
    const namespace = 'https://api.cuattro.4lumen.com';
    
    // Primeiro tenta obter o role numérico diretamente
    const numericRole = auth0User[`${namespace}/role`];
    if (typeof numericRole === 'number' && numericRole >= 0 && numericRole <= 2) {
      console.log('Role numérico encontrado:', numericRole);
      return numericRole as Role;
    }

    // Verifica em diferentes locais possíveis do token
    const roleLocations = [
      auth0User[`${namespace}/roles`],
      auth0User[`${namespace}/role`],
      auth0User['roles'],
      auth0User['role'],
      // Verifica também em app_metadata e user_metadata
      auth0User['app_metadata']?.role,
      auth0User['app_metadata']?.roles,
      auth0User['user_metadata']?.role,
      auth0User['user_metadata']?.roles
    ];

    console.log('Audience configurada:', auth0Config.audience);
    console.log('Possíveis localizações de roles:', roleLocations);
    console.log('Campos disponíveis no auth0User:', Object.keys(auth0User));

    // Tenta encontrar um role válido em qualquer uma das localizações
    for (const roles of roleLocations) {
      if (Array.isArray(roles) && roles.length > 0) {
        console.log('Encontrou array de roles:', roles);
        // Se for um array de strings com os nomes dos roles
        if (typeof roles[0] === 'string') {
          const roleMap: { [key: string]: Role } = {
            'admin': Role.Admin,
            'Admin': Role.Admin,
            'funcionario': Role.Funcionario,
            'Funcionario': Role.Funcionario,
            'cliente': Role.Cliente,
            'Cliente': Role.Cliente,
            'customer': Role.Cliente,
            'Customer': Role.Cliente
          };
          
          const roleName = roles[0];
          if (roleMap[roleName] !== undefined) {
            console.log('Role mapeado pelo nome:', roleName, roleMap[roleName]);
            return roleMap[roleName];
          }
        }
        
        // Se for um número
        const roleNumber = parseInt(roles[0].toString());
        if (!isNaN(roleNumber) && roleNumber >= 0 && roleNumber <= 2) {
          console.log('Role mapeado pelo número:', roleNumber);
          return roleNumber as Role;
        }
      } else if (typeof roles === 'string') {
        // Se for uma string única
        const roleMap: { [key: string]: Role } = {
          'admin': Role.Admin,
          'Admin': Role.Admin,
          'funcionario': Role.Funcionario,
          'Funcionario': Role.Funcionario,
          'cliente': Role.Cliente,
          'Cliente': Role.Cliente,
          'customer': Role.Cliente,
          'Customer': Role.Cliente
        };
        
        const roleName = roles;
        if (roleMap[roleName] !== undefined) {
          console.log('Role mapeado pela string única:', roleName, roleMap[roleName]);
          return roleMap[roleName];
        }

        // Se for um número em string
        const roleNumber = parseInt(roles);
        if (!isNaN(roleNumber) && roleNumber >= 0 && roleNumber <= 2) {
          console.log('Role mapeado pelo número em string:', roleNumber);
          return roleNumber as Role;
        }
      }
    }

    // Se não encontrar um role válido, retorna o role de cliente por padrão
    console.log('Nenhum role válido encontrado, retornando Cliente como padrão');
    return Role.Cliente;
  }
};

export default AuthService;
