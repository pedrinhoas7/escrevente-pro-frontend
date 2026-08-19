<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useProcessosStore } from '../stores/processos'
import { useClientesStore } from '../stores/clientes'
import { useRelatorio } from '../composables/useRelatorio'
import PeriodFilter from '../components/PeriodFilter.vue'
import type { FiltroPeriodo } from '../composables/useRelatorio'

const processosStore = useProcessosStore()
const clientesStore = useClientesStore()

const periodo = ref<FiltroPeriodo>('6m')
const dataInicio = ref<string | undefined>(undefined)
const dataFim = ref<string | undefined>(undefined)

onMounted(() => {
  processosStore.fetchProcessos()
  clientesStore.fetchClientes()
})

const processos = computed(() => processosStore.processos)
const clientes = computed(() => clientesStore.clientes)

const relatorio = useRelatorio(processos, periodo, dataInicio, dataFim)

function getClienteNome(apresentanteId?: string): string {
  if (!apresentanteId) return '—'
  const cliente = clientes.value.find(c => c.id === apresentanteId)
  return cliente ? cliente.nome : 'Cliente não encontrado'
}

function statusAtual(p: { statusHistory?: { status: string }[] }): string {
  return p.statusHistory?.[0]?.status ?? '—'
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  'Entrada': { label: 'Entrada', bg: 'rgba(255, 226, 99, 0.3)', text: '#CFB53B' },
  'Em análise': { label: 'Em Análise', bg: '#DBEAFE', text: '#1D4ED8' },
  'Falta de documento': { label: 'Pendente', bg: '#FED7AA', text: '#EA580C' },
  'Indeferido': { label: 'Indeferido', bg: '#FCA5A5', text: '#DC2626' },
  'Aguardando assinatura': { label: 'Assinatura', bg: '#D1FAE5', text: '#059669' },
  'Aguardando Pagamento': { label: 'Aguardando Pagamento', bg: '#FEF3C7', text: '#D97706' },
  'Boleto Pago': { label: 'Boleto Pago', bg: '#ECFCCB', text: '#65A30D' },
  'Assinado': { label: 'Assinado', bg: '#E9D5FF', text: '#9333EA' },
  'Enviado para registro': { label: 'Enviado para registro', bg: '#E0E7FF', text: '#4F46E5' },
  'Registrado': { label: 'Registrado', bg: '#DCFCE7', text: '#15803D' },
  'Documentação entregue ao cliente': { label: 'Entregue', bg: '#A7F3D0', text: '#047857' },
  'Concluído / Registrado': { label: 'Concluído', bg: '#E5E7EB', text: '#6B7280' },
}

function getStatusInfo(status: string) {
  return statusConfig[status] ?? { label: status, bg: '#F3F4F6', text: '#6B7280' }
}

const linhasOrdenadas = computed(() =>
  [...relatorio.processosFiltrados.value].sort((a, b) => {
    const aDate = a.criadoEm?._seconds || 0
    const bDate = b.criadoEm?._seconds || 0
    return bDate - aDate
  }),
)

function imprimir() {
  window.print()
}
</script>

<template>
  <div class="relatorio-container mr-4">
    <main class="relatorio-main">
      <div class="relatorio-content">

        <section class="relatorio-header">
          <div>
            <h1 class="relatorio-title">Relatório de Comissões</h1>
            <p class="relatorio-subtitle">
              {{ relatorio.periodLabel.value }}
            </p>
          </div>
          <button class="btn-export" @click="imprimir()">
            <span class="material-symbols-outlined">print</span>
            <span class="btn-export-text">Imprimir</span>
          </button>
        </section>

        <section class="filter-section">
          <PeriodFilter
            v-model="periodo"
            v-model:data-inicio="dataInicio"
            v-model:data-fim="dataFim"
          />
        </section>

        <section class="resumo-grid">
          <div class="resumo-card resumo-card-navy">
            <p class="resumo-label">Comissão Escrevente</p>
            <h3 class="resumo-value">{{ relatorio.formatarMoeda(relatorio.totalComissaoEscrevente.value) }}</h3>
            <p class="resumo-count">{{ linhasOrdenadas.length }} processos</p>
          </div>
          <div class="resumo-card resumo-card-gold">
            <p class="resumo-label">Comissão Apresentante</p>
            <h3 class="resumo-value">{{ relatorio.formatarMoeda(relatorio.totalComissaoApresentante.value) }}</h3>
            <p class="resumo-count">{{ linhasOrdenadas.length }} processos</p>
          </div>
          <div class="resumo-card">
            <p class="resumo-label">Valor Total Processos</p>
            <h3 class="resumo-value">{{ relatorio.formatarMoeda(relatorio.totalValorProcessos.value) }}</h3>
            <p class="resumo-count">Soma dos valores</p>
          </div>
          <div class="resumo-card">
            <p class="resumo-label">Emolumentos</p>
            <h3 class="resumo-value">{{ relatorio.formatarMoeda(relatorio.totalEmolumentos.value) }}</h3>
            <p class="resumo-count">Total recolhido</p>
          </div>
        </section>

        <section class="tabela-section">
          <div v-if="processosStore.loading" class="loading-state">
            <div class="spinner"></div>
            <p>Carregando relatório...</p>
          </div>

          <div v-else-if="linhasOrdenadas.length === 0" class="empty-state">
            <div class="empty-icon">
              <span class="material-symbols-outlined">receipt_long</span>
            </div>
            <p class="empty-title">Nenhum processo no período</p>
            <p class="empty-subtitle">Ajuste o filtro para ver resultados</p>
          </div>

          <div v-else class="tabela-wrapper">
            <table class="tabela-relatorio">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Protocolo</th>
                  <th>Apresentante</th>
                  <th>Status</th>
                  <th class="th-right">Valor Processo</th>
                  <th class="th-right">Com. Escrevente</th>
                  <th class="th-right">Com. Apresentante</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in linhasOrdenadas" :key="p.id">
                  <td class="td-data">{{ relatorio.formatarData(p.criadoEm) }}</td>
                  <td class="td-tipo">{{ p.tipoAto }}</td>
                  <td class="td-protocolo">{{ p.protocolo || '—' }}</td>
                  <td class="td-apresentante">{{ getClienteNome(p.partes.apresentante) }}</td>
                  <td>
                    <span
                      class="status-badge"
                      :style="{
                        backgroundColor: getStatusInfo(statusAtual(p)).bg,
                        color: getStatusInfo(statusAtual(p)).text,
                      }"
                    >
                      {{ getStatusInfo(statusAtual(p)).label }}
                    </span>
                  </td>
                  <td class="td-right td-moeda">{{ relatorio.formatarMoeda(p.valorProcesso || 0) }}</td>
                  <td class="td-right td-moeda">{{ relatorio.formatarMoeda(p.comissaoEscrevente || 0) }}</td>
                  <td class="td-right td-moeda">{{ relatorio.formatarMoeda(p.comissaoApresentante || 0) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="5" class="tf-label">Total</td>
                  <td class="tf-right tf-moeda">{{ relatorio.formatarMoeda(relatorio.totalValorProcessos.value) }}</td>
                  <td class="tf-right tf-moeda">{{ relatorio.formatarMoeda(relatorio.totalComissaoEscrevente.value) }}</td>
                  <td class="tf-right tf-moeda">{{ relatorio.formatarMoeda(relatorio.totalComissaoApresentante.value) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div v-if="linhasOrdenadas.length > 0" class="cartao-mobile">
            <div v-for="p in linhasOrdenadas" :key="p.id" class="cartao-item">
              <div class="cartao-topo">
                <span class="cartao-tipo">{{ p.tipoAto }}</span>
                <span
                  class="status-badge"
                  :style="{
                    backgroundColor: getStatusInfo(statusAtual(p)).bg,
                    color: getStatusInfo(statusAtual(p)).text,
                  }"
                >
                  {{ getStatusInfo(statusAtual(p)).label }}
                </span>
              </div>
              <p class="cartao-data">{{ relatorio.formatarData(p.criadoEm) }} · Prot. {{ p.protocolo || '—' }}</p>
              <p class="cartao-apresentante">{{ getClienteNome(p.partes.apresentante) }}</p>
              <div class="cartao-valores">
                <div>
                  <p class="cartao-valores-label">Valor</p>
                  <p class="cartao-valores-numero">{{ relatorio.formatarMoeda(p.valorProcesso || 0) }}</p>
                </div>
                <div>
                  <p class="cartao-valores-label">Com. Escr.</p>
                  <p class="cartao-valores-numero">{{ relatorio.formatarMoeda(p.comissaoEscrevente || 0) }}</p>
                </div>
                <div>
                  <p class="cartao-valores-label">Com. Apr.</p>
                  <p class="cartao-valores-numero">{{ relatorio.formatarMoeda(p.comissaoApresentante || 0) }}</p>
                </div>
              </div>
            </div>
            <div class="cartao-total">
              <div>
                <p class="cartao-valores-label">Valor Total</p>
                <p class="cartao-valores-numero">{{ relatorio.formatarMoeda(relatorio.totalValorProcessos.value) }}</p>
              </div>
              <div>
                <p class="cartao-valores-label">Com. Escr.</p>
                <p class="cartao-valores-numero">{{ relatorio.formatarMoeda(relatorio.totalComissaoEscrevente.value) }}</p>
              </div>
              <div>
                <p class="cartao-valores-label">Com. Apr.</p>
                <p class="cartao-valores-numero">{{ relatorio.formatarMoeda(relatorio.totalComissaoApresentante.value) }}</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<style scoped>
.relatorio-container {
  background-color: #faf9f6;
  min-height: 100vh;
}

.relatorio-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px;
}

@media (max-width: 767px) {
  .relatorio-content {
    padding: 16px;
  }
}

.relatorio-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .relatorio-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.relatorio-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 32px;
  font-weight: 700;
  color: #112752;
  margin: 0 0 4px 0;
}

@media (max-width: 767px) {
  .relatorio-title {
    font-size: 24px;
  }
}

.relatorio-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #112752;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-export:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(17, 39, 82, 0.2);
}

.btn-export .material-symbols-outlined {
  font-size: 20px;
}

.filter-section {
  margin-bottom: 32px;
}

.resumo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

@media (min-width: 1024px) {
  .resumo-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 24px;
  }
}

.resumo-card {
  background: #ffffff;
  border: 1px solid rgba(117, 119, 128, 0.2);
  border-radius: 12px;
  padding: 24px;
}

.resumo-card-navy {
  background: linear-gradient(135deg, rgba(17, 39, 82, 0.08) 0%, rgba(17, 39, 82, 0.03) 100%);
  border-color: rgba(17, 39, 82, 0.2);
}

.resumo-card-gold {
  background: linear-gradient(135deg, rgba(207, 181, 59, 0.12) 0%, rgba(207, 181, 59, 0.04) 100%);
  border-color: rgba(207, 181, 59, 0.3);
}

.resumo-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 8px 0;
}

.resumo-value {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 4px 0;
}

.resumo-count {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #6B7280;
  margin: 0;
}

.tabela-section {
  background: #ffffff;
  border: 1px solid rgba(117, 119, 128, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.loading-state {
  padding: 64px 24px;
  text-align: center;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(17, 39, 82, 0.15);
  border-top-color: #112752;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6B7280;
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
  margin: 0 auto 12px;
}

.empty-icon .material-symbols-outlined {
  color: #6B7280;
  font-size: 28px;
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

.tabela-wrapper {
  overflow-x: auto;
}

.tabela-relatorio {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.tabela-relatorio thead {
  display: none;
}

@media (min-width: 1024px) {
  .tabela-relatorio thead {
    display: table-header-group;
  }
}

.tabela-relatorio thead th {
  text-align: left;
  padding: 16px 20px;
  background: #F4F3F0;
  font-size: 11px;
  font-weight: 500;
  color: #44464f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid rgba(117, 119, 128, 0.1);
  white-space: nowrap;
}

.th-right {
  text-align: right;
}

.tabela-relatorio tbody tr {
  border-bottom: 1px solid rgba(117, 119, 128, 0.05);
  transition: background-color 0.15s;
}

.tabela-relatorio tbody tr:hover {
  background-color: #F8F7F4;
}

.tabela-relatorio td {
  padding: 14px 20px;
  color: #1a1c1a;
  white-space: nowrap;
}

.td-data {
  color: #6B7280;
  font-size: 13px;
}

.td-tipo {
  font-weight: 600;
  color: #112752;
}

.td-protocolo {
  font-family: monospace;
  font-size: 13px;
  color: #6B7280;
}

.td-apresentante {
  color: #44464f;
}

.td-right {
  text-align: right;
}

.td-moeda {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.tabela-relatorio tfoot {
  display: none;
}

@media (min-width: 1024px) {
  .tabela-relatorio tfoot {
    display: table-footer-group;
  }
}

.tabela-relatorio tfoot td {
  background: #F4F3F0;
  padding: 16px 20px;
  font-weight: 700;
  color: #112752;
  border-top: 2px solid rgba(17, 39, 82, 0.1);
}

.tf-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: right;
}

.tf-right {
  text-align: right;
}

.tf-moeda {
  font-family: 'Libre Caslon Text', serif;
  font-size: 16px;
  font-variant-numeric: tabular-nums;
}

.status-badge {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.cartao-mobile {
  display: flex;
  flex-direction: column;
  gap: 0;
}

@media (min-width: 1024px) {
  .cartao-mobile {
    display: none;
  }
}

.cartao-item {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(117, 119, 128, 0.08);
}

.cartao-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.cartao-tipo {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #112752;
}

.cartao-data {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #6B7280;
  margin: 0 0 4px 0;
}

.cartao-apresentante {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #44464f;
  margin: 0 0 12px 0;
}

.cartao-valores {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.cartao-valores-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 2px 0;
}

.cartao-valores-numero {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #112752;
  font-variant-numeric: tabular-nums;
  margin: 0;
}

.cartao-total {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  padding: 20px;
  background: #F4F3F0;
  border-top: 2px solid rgba(17, 39, 82, 0.1);
}

.cartao-total .cartao-valores-numero {
  font-size: 16px;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

@media print {
  .btn-export,
  .filter-section,
  .cartao-mobile {
    display: none !important;
  }

  .tabela-relatorio thead {
    display: table-header-group !important;
  }

  .tabela-relatorio tfoot {
    display: table-footer-group !important;
  }

  .tabela-section {
    border: none;
  }
}
</style>