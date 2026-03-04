import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

// Interceptor para adicionar o token em cada requisição
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de resposta e renovar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Se o erro for 401 e ainda não tentamos renovar o token para esta requisição
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca que já tentamos uma vez

      try {
        const newToken = await authStore.attemptRefreshToken();
        // Atualiza o header da requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Reenvia a requisição original com o novo token
        return api(originalRequest);
      } catch (refreshError) {
        // Se a renovação falhar, o logout já foi feito na store
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
