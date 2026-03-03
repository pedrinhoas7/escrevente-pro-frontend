import { defineStore } from 'pinia';
import api from '../services/api';
import { useAuthStore } from './auth';

interface Partes {
  outorganteVendedor: string;
  outorganteComprador: string;
  escrevente: string;
  apresentante: string;
}

interface Processo {
  id?: string;
  protocolo?: string;
  tipoAto: string;
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
    tiposAto: [
        'Ata Notarial',
        'Autenticação de Cópia',
        'Contrato de Compra e Venda',
        'Contrato de Doação',
        'Contrato de Locação',
        'Escritura de Imóvel',
        'Procuração',
        'Reconhecimento de Firma',
        'Testamento',
        'Outro'
    ] as string[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProcessos() {
      const authStore = useAuthStore();
      if (!authStore.userId) return;

      this.loading = true;
      try {
        const response = await api.get('/processos', { params: { userId: authStore.userId } });
        this.processos = response.data;
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
