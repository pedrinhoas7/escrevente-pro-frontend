import { defineStore } from 'pinia';
import api from '../services/api';

interface Escrevente {
  uid: string;
  email: string;
  nome: string;
  cartorioId: string;
  ativo: boolean;
  criadoEm?: any;
}

export const useEscreventesStore = defineStore('escreventes', {
  state: () => ({
    escreventes: [] as Escrevente[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchEscreventes() {
      this.loading = true;
      try {
        const response = await api.get('/escreventes');
        this.escreventes = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async addEscrevente(escrevente: { email: string; password: string; nome: string }) {
      try {
        const response = await api.post('/escreventes', escrevente);
        this.escreventes.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },
    async updateEscrevente(id: string, data: Partial<Escrevente>) {
      try {
        await api.put(`/escreventes/${id}`, data);
        const index = this.escreventes.findIndex(e => e.uid === id);
        if (index !== -1) {
          this.escreventes[index] = { ...this.escreventes[index], ...data } as Escrevente;
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },
    async deleteEscrevente(id: string) {
      try {
        await api.delete(`/escreventes/${id}`);
        this.escreventes = this.escreventes.filter(e => e.uid !== id);
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },
  },
});