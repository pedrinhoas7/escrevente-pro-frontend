import { defineStore } from 'pinia';
import api from '../services/api';
import type { TipoDeAto } from '../types/tipo-ato';

interface Partes {
  outorganteVendedor: string;
  outorganteComprador: string;
  escrevente: string;
  apresentante: string;
}

export interface Processo {
  id?: string;
  protocolo?: string;
  tipoAto: TipoDeAto;
  dataEntrada: string; // ou Date
  partes: Partes;
  notasInternas: string;
  criadoEm?: any;
  statusHistory?: any[];
}

export const useProcessosStore = defineStore('processos', {
  state: () => ({
    processos: [] as Processo[],
    processoAtual: null as Processo | null,
    tiposAto: [] as TipoDeAto[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProcessos() {
      this.loading = true;
      try {
        // The backend now filters processes based on the authenticated user (e.g., JWT).
        const response = await api.get('/processos');
        this.processos = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchTiposAto() {
        this.loading = true;
        try {
            const response = await api.get('/tipos-ato');
            this.tiposAto = response.data;
        } catch (error: any) {
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    },
    async getProcesso(id: string) {
        this.loading = true;
        try {
            const response = await api.get(`/processos/${id}`);
            this.processoAtual = response.data;
        } catch (error: any) {
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    },
    async addProcesso(processo: Processo) {
        try {
            const response = await api.post('/processos', processo);
            this.processos.unshift(response.data); // Adiciona ao início
            return response.data;
        } catch (error: any) {
            this.error = error.message;
            throw error;
        }
    },
    async addStatus(id: string, statusData: { status: string; observacao: string }) {
        try {
            await api.post(`/processos/${id}/status`, statusData);
            // Atualiza o processo atual para refletir o novo status
            await this.getProcesso(id);
        } catch (error: any) {
            throw error;
        }
    },
    async consultarProtocolo(protocolo: string) {
        this.loading = true;
        try {
            const response = await api.get(`/consulta/${protocolo}`); // Endpoint público sem /api/processos/consulta
            this.processoAtual = response.data;
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

