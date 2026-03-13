import { defineStore } from 'pinia';
import api from '../services/api';

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
    clienteAtual: null as Cliente | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchClientes() {
      this.loading = true;
      try {
        // The backend now filters clients based on the authenticated user (e.g., JWT).
        const response = await api.get(`/clientes`);
        this.clientes = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchCliente(id: string) {
      this.loading = true;
      try {
        const response = await api.get(`/clientes/${id}`);
        this.clienteAtual = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateCliente(id: string, cliente: Partial<Cliente>) {
      this.loading = true;
      try {
        const response = await api.put(`/clientes/${id}`, cliente);
        const index = this.clientes.findIndex(c => c.id === id);
        if (index !== -1) {
          this.clientes[index] = { ...this.clientes[index], ...response.data };
        }
        await this.fetchClientes(); // Re-fetch para garantir dados atualizados
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
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
