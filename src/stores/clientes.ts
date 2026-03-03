import { defineStore } from 'pinia';
import api from '../services/api';
import { useAuthStore } from './auth';

interface Cliente {
  id?: string;
  nome: string;
  cpf?: string;
  telefone: string;
  email?: string;
  endereco: string;
  criadoEm?: any;
}

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [] as Cliente[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchClientes() {
      const authStore = useAuthStore();
      if (!authStore.userId) return;

      this.loading = true;
      try {
        const response = await api.get(`/clientes`, { params: { userId: authStore.userId } });
        this.clientes = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async addCliente(cliente: Omit<Cliente, 'id' | 'criadoEm'>) {
      this.loading = true;
      try {
        const response = await api.post('/clientes', cliente);
        this.clientes.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});
