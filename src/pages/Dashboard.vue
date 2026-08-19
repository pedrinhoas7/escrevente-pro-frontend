<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useProcessosStore } from '../stores/processos';
import { useClientesStore } from '../stores/clientes';
import { useAuthStore } from '../stores/auth';
import { useEvolucao, type Periodo } from '../composables/useEvolucao';
import LineChart from '../components/LineChart.vue';
import PeriodSelector from '../components/PeriodSelector.vue';

const processosStore = useProcessosStore();
const clientesStore = useClientesStore();
const authStore = useAuthStore();

const periodoSelecionado = ref<Periodo>('6m');

onMounted(() => {
  processosStore.fetchProcessos();
  clientesStore.fetchClientes();
});

const processos = computed(() => processosStore.processos);
const clientes = computed(() => clientesStore.clientes);

const evolucao = useEvolucao(processos, clientes, periodoSelecionado);

const processosAbertos = computed(() =>
  processos.value.filter(p => {
    const ultimo = p.statusHistory?.[0]?.status;
    return ultimo && !['Concluído / Registrado', 'Indeferido'].includes(ultimo);
  }).length
);

const pendentes = computed(() =>
  processos.value.filter(p =>
    p.statusHistory?.[0]?.status === 'Aguardando assinatura'
  ).length
);

const orcamentos = computed(() =>
  processos.value.filter(p =>
    p.protocolo == undefined
  ).length
);

const hoje = computed(() => {
  const now = new Date();
  const inicioDoDia = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  return processos.value.filter(p => {
    const criado = p.criadoEm?._seconds
      ? new Date(p.criadoEm._seconds * 1000)
      : new Date(p.criadoEm);
    return criado >= inicioDoDia
  }).length;
});

const lastSevenDays = computed(() => {
  const now = new Date();
  const filter = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7,
  );
  return processos.value.filter(p => {
    const criado = p.criadoEm?._seconds
      ? new Date(p.criadoEm._seconds * 1000)
      : new Date(p.criadoEm);
    return criado >= filter
  }).length;
});

const concluidos = computed(() =>
  processos.value.filter(p =>
    p.statusHistory?.[0]?.status === 'Concluído / Registrado'
  ).length
);

const totalComissaoApresentante = computed(() => {
  return processos.value.reduce((sum, p) => sum + (p.comissaoApresentante || 0), 0);
});

const totalComissaoEscrevente = computed(() => {
  return processos.value.reduce((sum, p) => sum + (p.comissaoEscrevente || 0), 0);
});

const processosRecentes = computed(() =>
  [...processos.value]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 5)
);

const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  'Entrada': { label: 'Entrada', bgColor: 'rgba(255, 226, 99, 0.3)', textColor: '#CFB53B' },
  'Em análise': { label: 'Em Análise', bgColor: '#DBEAFE', textColor: '#1D4ED8' },
  'Falta de documento': { label: 'Pendente', bgColor: '#FED7AA', textColor: '#EA580C' },
  'Indeferido': { label: 'Indeferido', bgColor: '#FCA5A5', textColor: '#DC2626' },
  'Aguardando assinatura': { label: 'Assinatura', bgColor: '#D1FAE5', textColor: '#059669' },
  'Documentação entregue ao cliente': { label: 'Entregue', bgColor: '#A7F3D0', textColor: '#047857' },
  'Concluído / Registrado': { label: 'Concluído', bgColor: '#E5E7EB', textColor: '#6B7280' },
};

function getStatusInfo(status: string) {
  return statusConfig[status] ?? { label: status, bgColor: '#F3F4F6', textColor: '#6B7280' };
}

function getIconColor(tipoAto: string): string {
  const map: Record<string, string> = {
    'escritura': '#3B82F6',
    'procuração': '#F59E0B',
    'inventário': '#8B5CF6',
    'reconhecimento': '#22C55E',
    'ata': '#EF4444',
  };
  const lowerCaseTipoAto = tipoAto ? tipoAto.toLowerCase() : '';
  const foundKey = Object.keys(map).find(k => lowerCaseTipoAto.includes(k));
  return foundKey ? map[foundKey] as string : '#CFB53B';
}

const formatDate = (date: any) => {
  if (!date) return '';
  const d = new Date(date._seconds ? date._seconds * 1000 : date);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatDateSimple = (date: any) => {
  if (!date) return '';
  const d = new Date(date._seconds ? date._seconds * 1000 : date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Hoje, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Ontem, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
};
</script>

<template>
  <div class="dashboard-container mr-4">
    <main class="dashboard-main">
      <div class="dashboard-content">
        
        <section class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Olá, Escrevente</h1>
            <p class="dashboard-subtitle">
              Bem-vindo ao seu painel de controle notarial. Você tem <strong>{{ processosAbertos }}</strong> processos ativos.
            </p>
          </div>
          <router-link to="/app/processos/novo" class="btn-primary hidden-mobile">
            <span class="material-symbols-outlined btn-icon">add</span>
            Novo Processo
          </router-link>
        </section>

        <section v-if="authStore.userRole === 'escrevente'" class="commissions-section">
          <div class="commissions-card">
            <div class="commissions-header">
              <span class="material-symbols-outlined commissions-icon">payments</span>
              <h3 class="commissions-title">Minhas Comissões</h3>
            </div>
            <div class="commissions-grid">
              <div>
                <p class="commissions-label">Total Apresentante</p>
                <p class="commissions-value">
                  {{ totalComissaoApresentante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                </p>
              </div>
              <div>
                <p class="commissions-label">Total Escrevente</p>
                <p class="commissions-value">
                  {{ totalComissaoEscrevente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon kpi-icon-primary">
              <span class="material-symbols-outlined">account_tree</span>
            </div>
            <p class="kpi-label">Processos Abertos</p>
            <h3 class="kpi-value kpi-value-primary">{{ String(processosAbertos).padStart(2, '0') }}</h3>
            <div v-if="hoje > 0" class="kpi-trend">
              <span class="material-symbols-outlined kpi-trend-icon">trending_up</span>
              <span>+{{ hoje }} hoje</span>
            </div>
            <div v-else-if="lastSevenDays > 0" class="kpi-trend">
              <span class="material-symbols-outlined kpi-trend-icon">trending_up</span>
              <span>+{{ lastSevenDays }} essa semana</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon-blue">
              <span class="material-symbols-outlined">draw</span>
            </div>
            <p class="kpi-label">Assinaturas Pendentes</p>
            <h3 class="kpi-value">{{ String(pendentes).padStart(2, '0') }}</h3>
            <p class="kpi-subtext">Aguardando</p>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon-gray">
              <span class="material-symbols-outlined">description</span>
            </div>
            <p class="kpi-label">Orçamentos</p>
            <h3 class="kpi-value">{{ String(orcamentos).padStart(2, '0') }}</h3>
            <p class="kpi-subtext kpi-subtext-danger">Não aderiram</p>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon-success">
              <span class="material-symbols-outlined">check_circle</span>
            </div>
            <p class="kpi-label">Concluídos</p>
            <h3 class="kpi-value">{{ String(concluidos).padStart(2, '0') }}</h3>
            <p class="kpi-subtext">Total</p>
          </div>
        </section>

        <section class="charts-section">
          <div class="charts-header">
            <h2 class="charts-section-title">Evolução</h2>
            <PeriodSelector v-model="periodoSelecionado" />
          </div>

          <div class="charts-grid">
            <div class="chart-card">
              <div class="chart-card-header">
                <div class="chart-icon chart-icon-navy">
                  <span class="material-symbols-outlined">account_tree</span>
                </div>
                <div>
                  <h3 class="chart-title">Evolução de Processos</h3>
                  <p class="chart-subtitle">Novos processos e conclusões por mês</p>
                </div>
              </div>
              <div class="chart-container">
                <LineChart
                  :labels="evolucao.labels.value"
                  :datasets="[
                    { label: 'Novos processos', data: evolucao.novosProcessos.value, color: '#112752' },
                    { label: 'Concluídos', data: evolucao.processosConcluidos.value, color: '#CFB53B' },
                  ]"
                />
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-card-header">
                <div class="chart-icon chart-icon-gold">
                  <span class="material-symbols-outlined">group</span>
                </div>
                <div>
                  <h3 class="chart-title">Evolução de Clientes</h3>
                  <p class="chart-subtitle">Novos cadastros por mês</p>
                </div>
              </div>
              <div class="chart-container">
                <LineChart
                  :labels="evolucao.labels.value"
                  :datasets="[
                    { label: 'Novos clientes', data: evolucao.novosClientes.value, color: '#112752' },
                  ]"
                />
              </div>
            </div>
          </div>
        </section>

        <div class="activity-grid mb-20">
          <section class="activity-section">
            <div class="activity-header">
              <h3 class="activity-title">Processos Recentes</h3>
              <router-link to="/app/processos" class="activity-link">Ver todos</router-link>
            </div>

            <div v-if="processosStore.loading" class="loading-container">
              <div v-for="i in 4" :key="i" class="loading-item">
                <div class="loading-avatar"></div>
                <div class="loading-content">
                  <div class="loading-line loading-line-wide"></div>
                  <div class="loading-line loading-line-narrow"></div>
                </div>
              </div>
            </div>

            <div v-else-if="processosRecentes.length > 0" class="activity-table">
              <div class="activity-table-header">
                <div class="table-cell">Identificador</div>
                <div class="table-cell hidden-mobile">Tipo</div>
                <div class="table-cell">Status</div>
                <div class="table-cell table-cell-right">Data</div>
              </div>
              
              <router-link
                v-for="processo in processosRecentes"
                :key="processo.id"
                :to="`/app/processos/${processo.id}`"
                class="activity-row"
              >
                <div class="table-cell">
                  <div class="process-info">
                    <div
                      class="process-icon"
                      :style="{ backgroundColor: getIconColor(processo.tipoAto) + '20' }"
                    >
                      <span
                        class="material-symbols-outlined"
                        :style="{ color: getIconColor(processo.tipoAto) }"
                      >description</span>
                    </div>
                    <div>
                      <p class="process-title">{{ processo.tipoAto }}</p>
                      <p class="process-subtitle">Prot. {{ processo.protocolo || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
                <div class="table-cell hidden-mobile">{{ processo.tipoAto }}</div>
                <div class="table-cell">
                  <span
                    v-if="processo.statusHistory?.[0]?.status"
                    class="status-badge"
                    :style="{
                      backgroundColor: getStatusInfo(processo.statusHistory[0].status).bgColor,
                      color: getStatusInfo(processo.statusHistory[0].status).textColor
                    }"
                  >
                    {{ getStatusInfo(processo.statusHistory[0].status).label }}
                  </span>
                </div>
                <div class="table-cell table-cell-right">
                  {{ formatDateSimple(processo.criadoEm) }}
                </div>
              </router-link>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">
                <span class="material-symbols-outlined">description</span>
              </div>
              <p class="empty-title">Nenhum processo ainda</p>
              <p class="empty-subtitle">Crie o primeiro processo clicando abaixo</p>
            </div>
          </section>

        </div>

      </div>
    </main>

    <div class="mobile-actions mr-4">
      <router-link to="/app/processos/novo" class="btn-primary-mobile">
        <span class="material-symbols-outlined">add</span>
        Novo Processo
      </router-link>
      <router-link to="/app/processos" class="btn-secondary-mobile">
        <span class="material-symbols-outlined">search</span>
        Buscar
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  background-color: #faf9f6;
  min-height: 100vh;
}

.dashboard-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px;
}

@media (max-width: 767px) {
  .dashboard-content {
    padding: 16px;
  }
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .dashboard-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.dashboard-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.25;
  color: #112752;
  margin: 0 0 8px 0;
}

@media (max-width: 767px) {
  .dashboard-title {
    font-size: 24px;
  }
}

.dashboard-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #44464f;
  margin: 0;
}

.dashboard-subtitle strong {
  color: #112752;
}

.btn-primary {
  background-color: #112752;
  color: #ffffff;
  padding: 12px 32px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: scale(1.02);
}

.btn-primary:active {
  transform: scale(0.98);
}

.hidden-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hidden-mobile {
    display: flex;
  }
}

.btn-icon {
  font-size: 20px;
}

.commissions-section {
  margin-bottom: 32px;
}

.commissions-card {
  background: linear-gradient(135deg, rgba(207, 181, 59, 0.15) 0%, rgba(207, 181, 59, 0.08) 100%);
  border: 1px solid rgba(207, 181, 59, 0.4);
  border-radius: 12px;
  padding: 24px;
}

.commissions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.commissions-icon {
  color: #CFB53B;
}

.commissions-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  color: #112752;
  margin: 0;
}

.commissions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .commissions-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.commissions-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #44464f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px 0;
}

.commissions-value {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #112752;
  margin: 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 48px;
}

@media (min-width: 1024px) {
  .kpi-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 24px;
  }
}

.kpi-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.kpi-icon-primary {
  background-color: rgba(207, 181, 59, 0.2);
  color: #112752;
}

.kpi-icon-blue {
  background-color: #DBEAFE;
  color: #1D4ED8;
}

.kpi-icon-gray {
  background-color: #F3F4F6;
  color: #6B7280;
}

.kpi-icon-success {
  background-color: #D1FAE5;
  color: #059669;
}

.kpi-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #44464f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 8px 0;
}

.kpi-value {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  color: #112752;
  margin: 0;
}

.kpi-value-primary {
  color: #112752;
}

.kpi-subtext {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #6B7280;
  margin: 4px 0 0 0;
}

.kpi-subtext-danger {
  color: #DC2626;
  font-weight: 500;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #059669;
}

.kpi-trend-icon {
  font-size: 16px;
}

.charts-section {
  margin-bottom: 48px;
}

.charts-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .charts-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.charts-section-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 28px;
  font-weight: 600;
  color: #112752;
  margin: 0;
}

@media (max-width: 767px) {
  .charts-section-title {
    font-size: 22px;
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-card {
  background: #ffffff;
  border: 1px solid rgba(117, 119, 128, 0.2);
  border-radius: 12px;
  padding: 24px;
}

.chart-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.chart-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chart-icon .material-symbols-outlined {
  font-size: 24px;
}

.chart-icon-navy {
  background-color: rgba(17, 39, 82, 0.1);
  color: #112752;
}

.chart-icon-gold {
  background-color: rgba(207, 181, 59, 0.15);
  color: #CFB53B;
}

.chart-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 2px 0;
}

.chart-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #6B7280;
  margin: 0;
}

.chart-container {
  position: relative;
  height: 280px;
  width: 100%;
  overflow: hidden;
}

.chart-container canvas {
  max-width: 100%;
}

@media (max-width: 767px) {
  .chart-card {
    padding: 16px;
  }

  .chart-card-header {
    margin-bottom: 16px;
  }

  .chart-container {
    height: 220px;
  }
}

.activity-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}



.activity-section {
  background: #ffffff;
  border: 1px solid rgba(117, 119, 128, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid rgba(117, 119, 128, 0.1);
}

.activity-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  color: #112752;
  margin: 0;
}

.activity-link {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #CFB53B;
  text-decoration: none;
}

.activity-link:hover {
  text-decoration: underline;
}

.loading-container {
  padding: 24px;
}

.loading-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.loading-avatar {
  width: 40px;
  height: 40px;
  background: #F3F4F6;
  border-radius: 8px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.loading-content {
  flex: 1;
}

.loading-line {
  background: #F3F4F6;
  height: 14px;
  margin-bottom: 8px;
  border-radius: 4px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.loading-line-wide {
  width: 75%;
}

.loading-line-narrow {
  width: 50%;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.activity-table {
  width: 100%;
}

.activity-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 16px 24px;
  background: #F4F3F0;
  border-bottom: 1px solid rgba(117, 119, 128, 0.1);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #44464f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 767px) {
  .activity-table-header {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.table-cell {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1a1c1a;
}

.table-cell-right {
  text-align: right;
}

.hidden-mobile {
  display: block;
}

@media (max-width: 767px) {
  .hidden-mobile {
    display: none;
  }
}

.activity-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(117, 119, 128, 0.05);
  text-decoration: none;
  transition: background-color 0.2s;
}

.activity-row:hover {
  background-color: #F4F3F0;
}

@media (max-width: 767px) {
  .activity-row {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.process-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.process-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.process-icon .material-symbols-outlined {
  font-size: 20px;
}

.process-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 4px 0;
}

.process-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #6B7280;
  margin: 0;
}

.status-badge {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.empty-state {
  padding: 64px 24px;
  text-align: center;
}

.empty-icon {
  width: 56px;
  height: 56px;
  background: #F3F4F6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
}

.empty-icon .material-symbols-outlined {
  color: #6B7280;
}

.empty-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 4px 0;
}

.empty-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #6B7280;
  margin: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.shortcuts-section {
  background: transparent;
}

.shortcuts-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 24px 0;
}

.shortcuts-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shortcut-card {
  background: #ffffff;
  border: 1px solid rgba(117, 119, 128, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  transition: all 0.2s;
}

.shortcut-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.shortcut-icon {
  width: 48px;
  height: 48px;
  background: #F3F4F6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #112752;
  transition: all 0.2s;
}

.shortcut-card:hover .shortcut-icon {
  background: #112752;
  color: #ffffff;
}

.shortcut-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 4px 0;
}

.shortcut-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #6B7280;
  margin: 0;
}

.upgrade-card {
  background: #112752;
  color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.upgrade-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.upgrade-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.9;
  margin: 0 0 24px 0;
}

.upgrade-button {
  background: #CFB53B;
  color: #112752;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.upgrade-button:hover {
  transform: scale(1.05);
}

.mobile-actions {
  position: fixed;
  bottom: 64px;
  left: 0;
  right: 0;
  background: rgba(250, 249, 246, 0.9);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(117, 119, 128, 0.2);
  padding: 16px;
  display: flex;
  gap: 16px;
}

@media (min-width: 768px) {
  .mobile-actions {
    display: none;
  }
}

.btn-primary-mobile {
  flex: 1;
  background: #112752;
  color: #ffffff;
  border-radius: 12px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}

.btn-primary-mobile:active {
  transform: scale(0.95);
}

.btn-secondary-mobile {
  flex: 1;
  background: transparent;
  color: #112752;
  border: 1px solid rgba(17, 39, 82, 0.3);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}

.btn-secondary-mobile:active {
  transform: scale(0.95);
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>