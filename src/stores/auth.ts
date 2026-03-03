import { defineStore } from 'pinia';
import api from '../services/api';
import router from '../router';

interface AuthState {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    isAuthenticated: !!localStorage.getItem('token'),
  }),
  actions: {
    setToken(token: string, userId: string) {
      this.token = token;
      this.userId = userId;
      this.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
    },
    logout() {
      this.token = null;
      this.userId = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      router.push('/login');
    },
    async login(email: string, password: string) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, userId } = response.data;
            this.setToken(token, userId);
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }
  },
});
