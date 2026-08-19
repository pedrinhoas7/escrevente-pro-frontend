import { defineStore } from 'pinia';
import router from '../router';
import api from '../services/api';

interface AuthState {
  token: string | null;
  userId: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  userRole: string | null;
  cartorioId: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    refreshToken: localStorage.getItem('refreshToken'),
    expiresAt: localStorage.getItem('expiresAt') ? parseInt(localStorage.getItem('expiresAt')!, 10) : null,
    userRole: localStorage.getItem('userRole'),
    cartorioId: localStorage.getItem('cartorioId'),
  }),
  getters: {
    isAuthenticated: (state) => {
      const now = new Date().getTime();
      return !!state.token && !!state.expiresAt && state.expiresAt > now;
    },
    userRole: (state) => state.userRole,
    cartorioId: (state) => state.cartorioId,
    isCartorio: (state) => state.userRole === 'cartorio',
  },
  actions: {
    setAuthData(token: string, userId: string, refreshToken: string, expiresIn: number, userRole: string | null = null, cartorioId: string | null = null) {
      const expiresAt = new Date().getTime() + expiresIn * 1000;
      
      this.token = token;
      this.userId = userId;
      this.refreshToken = refreshToken;
      this.expiresAt = expiresAt;
      this.userRole = userRole;
      this.cartorioId = cartorioId;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('expiresAt', expiresAt.toString());
      if (userRole) {
        localStorage.setItem('userRole', userRole);
      } else {
        localStorage.removeItem('userRole');
      }
      if (cartorioId) {
        localStorage.setItem('cartorioId', cartorioId);
      } else {
        localStorage.removeItem('cartorioId');
      }
    },
    logout() {
      this.token = null;
      this.userId = null;
      this.refreshToken = null;
      this.expiresAt = null;
      this.userRole = null;
      this.cartorioId = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('userRole');
      localStorage.removeItem('cartorioId');

      router.push('/');
    },
    async login(email: string, password: string) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, userId, refreshToken, expiresIn, userRole, cartorioId } = response.data;
            this.setAuthData(token, userId, refreshToken, expiresIn, userRole, cartorioId);
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    },
    async attemptRefreshToken() {
      if (!this.refreshToken) {
        return Promise.reject(new Error('No refresh token available'));
      }
      try {
        const response = await api.post('/auth/refresh-token', { refreshToken: this.refreshToken });
        const { token, userId, refreshToken, expiresIn, userRole, cartorioId } = response.data;
        this.setAuthData(token, userId, refreshToken, expiresIn, userRole, cartorioId);
        return token;
      } catch (error) {
        console.error('Falha ao renovar o token, fazendo logout:', error);
        this.logout();
        return Promise.reject(error);
      }
    }
  },
});
