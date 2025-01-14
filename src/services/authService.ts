import { Auth0Client } from '@auth0/auth0-spa-js';
import { User } from '../types';

const auth0 = new Auth0Client({
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'dev-p0emhjwrs2yxtq75.us.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'pXRkdIHA6F3v1sGSB15H8RGmSaZgpY5I',
  authorizationParams: {
    redirect_uri: window.location.origin
  }
});

const AuthService = {
  async login(): Promise<User> {
    try {
      await auth0.loginWithPopup();
      const user = await auth0.getUser();
      
      if (!user) {
        throw new Error('Authentication failed');
      }

      if (!user?.sub) {
        throw new Error('User ID is undefined');
      }
      
      return {
        id: user.sub,
        auth0Id: user.sub,
        nome: user.name || user.nickname || '',
        email: user.email || '',
        role: user['https://buffet-app.com/roles']?.[0] || 0
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const isAuthenticated = await auth0.isAuthenticated();
      if (!isAuthenticated) return null;

      const user = await auth0.getUser();
      if (!user) return null;

      if (!user.sub) {
        return null;
      }
      
      return {
        id: user.sub,
        auth0Id: user.sub,
        nome: user.name || user.nickname || '',
        email: user.email || '',
        role: user['https://buffet-app.com/roles']?.[0] || 0
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await auth0.getTokenSilently();
    } catch (error) {
      console.error('Get access token error:', error);
      return null;
    }
  }
};

export default AuthService;
