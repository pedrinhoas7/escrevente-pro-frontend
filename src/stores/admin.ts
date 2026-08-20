import { defineStore } from 'pinia';
import api from '../services/api';

interface Usuario {
  uid: string;
  email: string;
  nome: string;
  role: string;
  cartorioId?: string | null;
  ativo: boolean;
  criadoEm?: any;
}

interface Cartorio {
  uid: string;
  nome: string;
  email: string;
}

interface DashboardMetrics {
  totalUsuarios: number;
  totalCartorios: number;
  totalEscreventes: number;
  totalAdmins: number;
  totalProcessos: number;
  totalClientes: number;
  totalPendentes: number;
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    usuarios: [] as Usuario[],
    cartorios: [] as Cartorio[],
    metrics: null as DashboardMetrics | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchUsuarios() {
      this.loading = true;
      try {
        const response = await api.get('/admin/usuarios');
        this.usuarios = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchCartorios() {
      try {
        const response = await api.get('/admin/cartorios');
        this.cartorios = response.data;
      } catch (error: any) {
        this.error = error.message;
      }
    },
    async fetchMetrics() {
      try {
        const response = await api.get('/admin/dashboard');
        this.metrics = response.data;
      } catch (error: any) {
        this.error = error.message;
      }
    },
    async criarUsuario(data: { email: string; nome: string; role: string; cartorioId?: string }) {
      try {
        await api.post('/admin/usuarios', data);
        await this.fetchUsuarios();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },
    async atualizarUsuario(uid: string, data: Partial<Usuario>) {
      try {
        await api.put(`/admin/usuarios/${uid}`, data);
        const index = this.usuarios.findIndex(u => u.uid === uid);
        if (index !== -1) {
          this.usuarios[index] = { ...this.usuarios[index], ...data } as Usuario;
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },
    async deletarUsuario(uid: string) {
      try {
        await api.delete(`/admin/usuarios/${uid}`);
        this.usuarios = this.usuarios.filter(u => u.uid !== uid);
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },
    async recuperarSenha(email: string) {
      try {
        await api.post('/admin/recuperar-senha', { email });
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },
    async completarCadastro(data: { email: string; password: string; nome: string; role?: string; cartorioId?: string }) {
      try {
        await api.post('/admin/completar-cadastro', data);
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },
  },
});