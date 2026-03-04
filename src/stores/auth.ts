import { defineStore } from 'pinia';
import router from '../router';
import api from '../services/api';

interface AuthState {
  token: string | null;
  userId: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    refreshToken: localStorage.getItem('refreshToken'),
    expiresAt: localStorage.getItem('expiresAt') ? parseInt(localStorage.getItem('expiresAt')!, 10) : null,
  }),
  getters: {
    isAuthenticated: (state) => {
      const now = new Date().getTime();
      return !!state.token && !!state.expiresAt && state.expiresAt > now;
    },
  },
  actions: {
    setAuthData(token: string, userId: string, refreshToken: string, expiresIn: number) {
      const expiresAt = new Date().getTime() + expiresIn * 1000;
      
      this.token = token;
      this.userId = userId;
      this.refreshToken = refreshToken;
      this.expiresAt = expiresAt;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('expiresAt', expiresAt.toString());
    },
    logout() {
      this.token = null;
      this.userId = null;
      this.refreshToken = null;
      this.expiresAt = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');

      router.push('/login');
    },
    async login(email: string, password: string) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, userId, refreshToken, expiresIn } = response.data;
            this.setAuthData(token, userId, refreshToken, expiresIn);
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
        const { token, userId, refreshToken, expiresIn } = response.data;
        this.setAuthData(token, userId, refreshToken, expiresIn);
        return token;
      } catch (error) {
        console.error('Falha ao renovar o token, fazendo logout:', error);
        this.logout();
        return Promise.reject(error);
      }
    }
  },
});
