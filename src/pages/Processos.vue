<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProcessosStore } from '../stores/processos'
import { useClientesStore } from '../stores/clientes'
import router from '../router'
import type { TipoDeAto } from '../types/tipo-ato'
import { formatCurrency, parseCurrency } from '../utils/currency'

const processosStore = useProcessosStore()
const clientesStore = useClientesStore()

const searchTerm = ref('')
const showModal = ref(false)

const novoProcesso = ref({
  protocolo: '',
  tipoAto: '' as TipoDeAto,
  dataEntrada: new Date().toISOString().slice(0, 10),
  partes: {
    outorganteVendedor: '',
    outorganteComprador: '',
    escrevente: '',
    apresentante: ''
  },
  valorProcesso: undefined as number | undefined,
  valorEmolumentos: undefined as number | undefined,
  notasInternas: ''
})

const valorProcessoInput = ref<string>('')
const valorEmolumentosInput = ref<string>('')

const onBlurValorProcesso = () => {
  novoProcesso.value.valorProcesso = parseCurrency(valorProcessoInput.value)
  valorProcessoInput.value = formatCurrency(novoProcesso.value.valorProcesso)
}

const onBlurValorEmolumentos = () => {
  novoProcesso.value.valorEmolumentos = parseCurrency(valorEmolumentosInput.value)
  valorEmolumentosInput.value = formatCurrency(novoProcesso.value.valorEmolumentos)
}

const tiposAto = computed<TipoDeAto[]>(() => processosStore.tiposAto)

type SortKey = 'apresentante' | 'comprador' | 'status' | 'data'
type SortOrder = 'asc' | 'desc'
const sortKey = ref<SortKey>('data')
const sortOrder = ref<SortOrder>('desc')

const toggleSort = (key: SortKey) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const getSortValue = (p: typeof processosStore.processos[number], key: SortKey): string | number => {
  switch (key) {
    case 'apresentante': return getClientName(p.partes.apresentante || '').toLowerCase()
    case 'comprador': return p.partes.outorganteComprador?.toLowerCase() || ''
    case 'status': return p.statusHistory?.[0]?.status?.toLowerCase() || ''
    case 'data': return p.criadoEm?._seconds || 0
  }
}

onMounted(() => {
  processosStore.fetchProcessos()
  clientesStore.fetchClientes()
  processosStore.fetchTiposAto()
})

const salvarProcesso = async () => {
  try {
    if (!novoProcesso.value.tipoAto) {
      alert('Tipo de Ato é obrigatório')
      return
    }
    const payload = { ...novoProcesso.value }
    if (payload.valorProcesso === undefined) delete payload.valorProcesso
    if (payload.valorEmolumentos === undefined) delete payload.valorEmolumentos
    await processosStore.addProcesso(payload)
    showModal.value = false
    novoProcesso.value = {
      protocolo: '',
      tipoAto: '' as TipoDeAto,
      dataEntrada: new Date().toISOString().slice(0, 10),
      partes: { outorganteVendedor: '', outorganteComprador: '', escrevente: '', apresentante: '' },
      valorProcesso: undefined,
      valorEmolumentos: undefined,
      notasInternas: ''
    }
    valorProcessoInput.value = ''
    valorEmolumentosInput.value = ''
  } catch (error) {
    alert('Erro ao salvar processo. Verifique o console.')
    console.error(error)
  }
}

const getClientName = (apresentanteId: string) => {
  const client = clientesStore.clientes.find(c => c.id === apresentanteId)
  return client ? client.nome : 'Cliente não encontrado'
}

const filteredProcessos = computed(() => {
  const sortedProcessos = [...processosStore.processos].sort((a, b) => {
    try {
      const aVal = getSortValue(a, sortKey.value)
      const bVal = getSortValue(b, sortKey.value)
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortOrder.value === 'asc' ? cmp : -cmp
    } catch {
      return 0
    }
  })

  if (!searchTerm.value) {
    return sortedProcessos
  }

  const term = searchTerm.value.toLowerCase()
  return sortedProcessos.filter(
    processo =>
      (processo.protocolo && processo.protocolo.toLowerCase().includes(term)) ||
      (processo.partes.outorganteComprador && processo.partes.outorganteComprador.toLowerCase().includes(term))
  )
})

const totalProcessos = computed(() => processosStore.processos.length)

const processosAtivos = computed(() =>
  processosStore.processos.filter(p => {
    const ultimo = p.statusHistory?.[0]?.status
    return ultimo && !['Concluído / Registrado', 'Registrado', 'Indeferido'].includes(ultimo)
  }).length
)

const processosPendentes = computed(() =>
  processosStore.processos.filter(p =>
    p.statusHistory?.[0]?.status === 'Aguardando assinatura'
  ).length
)

const processosConcluidos = computed(() =>
  processosStore.processos.filter(p =>
    p.statusHistory?.[0]?.status === 'Concluído / Registrado' ||
    p.statusHistory?.[0]?.status === 'Registrado'
  ).length
)

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  'Entrada': { label: 'Entrada', bg: 'bg-secondary-container/30', text: 'text-secondary', icon: 'description' },
  'Em análise': { label: 'Em Análise', bg: 'bg-blue-100', text: 'text-blue-700', icon: 'analytics' },
  'Falta de documento': { label: 'Pendente', bg: 'bg-orange-100', text: 'text-orange-700', icon: 'error_outline' },
  'Indeferido': { label: 'Indeferido', bg: 'bg-error-container/50', text: 'text-error', icon: 'cancel' },
  'Aguardando assinatura': { label: 'Assinatura', bg: 'bg-tertiary-container/30', text: 'text-green-700', icon: 'draw' },
  'Aguardando Pagamento': { label: 'Aguardando Pagamento', bg: 'bg-amber-100', text: 'text-amber-700', icon: 'payments' },
  'Boleto Pago': { label: 'Boleto Pago', bg: 'bg-lime-100', text: 'text-lime-700', icon: 'payments' },
  'Assinado': { label: 'Assinado', bg: 'bg-purple-100', text: 'text-purple-700', icon: 'draw' },
  'Enviado para registro': { label: 'Enviado para registro', bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'outbox' },
  'Registrado': { label: 'Registrado', bg: 'bg-green-100', text: 'text-green-700', icon: 'check_circle' },
  'Documentação entregue ao cliente': { label: 'Entregue', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'task_alt' },
  'Concluído / Registrado': { label: 'Concluído', bg: 'bg-surface-container-high', text: 'text-on-surface-variant', icon: 'check_circle' },
}

function getStatusInfo(status: string) {
  return statusConfig[status] ?? { label: status, bg: 'bg-surface-container', text: 'text-on-surface-variant', icon: 'description' }
}

const formatDate = (date: any) => {
  if (!date) return ''
  const d = new Date(date._seconds ? date._seconds * 1000 : date)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Hoje, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffDays === 1) {
    return `Ontem, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  } else {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }
}

const abrirProcesso = (id: string) => {
  router.push(`/app/processos/${id}`)
}

const editarProcesso = (id: string, event: Event) => {
  event.stopPropagation()
  router.push(`/app/processos/${id}/editar`)
}

const excluirProcesso = async (id: string, event: Event) => {
  event.stopPropagation()
  if (confirm('Tem certeza que deseja excluir este processo e todo seu histórico?')) {
    try {
      await processosStore.deleteProcesso(id)
    } catch (error) {
      alert('Erro ao excluir processo.')
      console.error(error)
    }
  }
}

const getIconColor = (tipoAto: string): string => {
  const map: Record<string, string> = {
    'escritura': '#3B82F6',
    'procuração': '#F59E0B',
    'inventário': '#8B5CF6',
    'reconhecimento': '#22C55E',
    'ata': '#EF4444',
  }
  const lowerCaseTipoAto = tipoAto ? tipoAto.toLowerCase() : ''
  const foundKey = Object.keys(map).find(k => lowerCaseTipoAto.includes(k))
  return foundKey ? map[foundKey] as string : '#CFB53B'
}
</script>

<template>
  <div class="bg-background min-h-screen pb-24  px-3 mr-4 ">
    <main>
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-lg mb-xl">
          <div>
            <h1 class="text-headline-lg font-serif font-bold text-primary mb-2">Gestão de Processos</h1>
            <p class="text-body-md text-on-surface-variant">Acompanhe e gerencie todos os processos cartoriais ativos.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-md items-center w-full lg:w-auto">
            <div class="relative w-full sm:w-80 ">
              <span
                class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline mt-3">search</span>
              <input v-model="searchTerm"
                class="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-label-md font-sans"
                placeholder="Buscar por protocolo ou comprador..." type="text" />
            </div>
            <button @click="showModal = true"
              class="w-full sm:w-auto bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md flex items-center justify-center gap-xs hover:shadow-lg transition-all active:scale-95">
              <span class="material-symbols-outlined">add</span>
              Novo Processo
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
          <div
            class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Processos
              Ativos</span>
            <span class="text-headline-md font-serif font-bold">{{ processosAtivos }}</span>
            <div class="flex items-center gap-xs text-secondary text-label-sm">
              <span class="material-symbols-outlined text-base">account_tree</span>
              <span>Em andamento</span>
            </div>
          </div>

          <div
            class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Assinaturas
              Pendentes</span>
            <span class="text-headline-md font-serif font-bold">{{ processosPendentes }}</span>
            <div class="flex items-center gap-xs text-orange-700 text-label-sm">
              <span class="material-symbols-outlined text-base">draw</span>
              <span>Aguardando</span>
            </div>
          </div>

          <div
            class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total
              Cadastrado</span>
            <span class="text-headline-md font-serif font-bold">{{ totalProcessos }}</span>
            <div class="flex items-center gap-xs text-on-surface-variant text-label-sm">
              <span class="material-symbols-outlined text-base">description</span>
              <span>No sistema</span>
            </div>
          </div>

          <div
            class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Concluídos</span>
            <span class="text-headline-md font-serif font-bold">{{ processosConcluidos }}</span>
            <div class="flex items-center gap-xs text-emerald-700 text-label-sm">
              <span class="material-symbols-outlined text-base">check_circle</span>
              <span>Finalizados</span>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <div
            class="px-lg py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-bright">
            <h3 class="text-body-lg font-serif font-bold">Listagem de Processos</h3>
            <span class="text-label-sm text-on-surface-variant flex items-center gap-xs">
              <span class="material-symbols-outlined text-base">swap_vert</span>
              Clique no cabeçalho para ordenar
            </span>
          </div>

          <div v-if="processosStore.loading" class="p-xl text-center">
            <div class="animate-pulse flex flex-col items-center gap-md">
              <div class="w-10 h-10 bg-surface-container rounded-xl"></div>
              <div class="h-4 bg-surface-container rounded w-1/2"></div>
              <p class="text-on-surface-variant">Carregando processos...</p>
            </div>
          </div>

          <div v-else-if="filteredProcessos.length === 0" class="p-xl text-center">
            <div class="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span class="material-symbols-outlined text-on-surface-variant">description</span>
            </div>
            <p class="text-primary font-semibold">Nenhum processo encontrado</p>
            <p class="text-on-surface-variant text-body-sm mt-1">Crie o primeiro processo clicando em "Novo Processo"
            </p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="text-left bg-surface-container-low border-b border-outline-variant/20">
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">PROCESSO</th>
                  <th @click="toggleSort('apresentante')" class="px-lg py-md text-label-sm font-label-sm cursor-pointer select-none transition-colors hover:bg-surface-container group/th" :class="sortKey === 'apresentante' ? 'text-primary' : 'text-on-surface-variant'">
                    <span class="flex items-center gap-xs">APRESENTANTE <span class="material-symbols-outlined text-sm opacity-0 group-hover/th:opacity-40 transition-opacity" :class="sortKey === 'apresentante' && 'opacity-100'">{{ sortKey === 'apresentante' && sortOrder === 'asc' ? 'arrow_upward' : sortKey === 'apresentante' && sortOrder === 'desc' ? 'arrow_downward' : 'swap_vert' }}</span></span>
                  </th>
                  <th @click="toggleSort('comprador')" class="px-lg py-md text-label-sm font-label-sm cursor-pointer select-none transition-colors hover:bg-surface-container group/th" :class="sortKey === 'comprador' ? 'text-primary' : 'text-on-surface-variant'">
                    <span class="flex items-center gap-xs">COMPRADOR <span class="material-symbols-outlined text-sm opacity-0 group-hover/th:opacity-40 transition-opacity" :class="sortKey === 'comprador' && 'opacity-100'">{{ sortKey === 'comprador' && sortOrder === 'asc' ? 'arrow_upward' : sortKey === 'comprador' && sortOrder === 'desc' ? 'arrow_downward' : 'swap_vert' }}</span></span>
                  </th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">PROTOCOLO</th>
                  <th @click="toggleSort('status')" class="px-lg py-md text-label-sm font-label-sm cursor-pointer select-none transition-colors hover:bg-surface-container group/th" :class="sortKey === 'status' ? 'text-primary' : 'text-on-surface-variant'">
                    <span class="flex items-center gap-xs">STATUS <span class="material-symbols-outlined text-sm opacity-0 group-hover/th:opacity-40 transition-opacity" :class="sortKey === 'status' && 'opacity-100'">{{ sortKey === 'status' && sortOrder === 'asc' ? 'arrow_upward' : sortKey === 'status' && sortOrder === 'desc' ? 'arrow_downward' : 'swap_vert' }}</span></span>
                  </th>
                  <th @click="toggleSort('data')" class="px-lg py-md text-label-sm font-label-sm cursor-pointer select-none transition-colors hover:bg-surface-container group/th text-right" :class="sortKey === 'data' ? 'text-primary' : 'text-on-surface-variant'">
                    <span class="flex items-center gap-xs justify-end">DATA <span class="material-symbols-outlined text-sm opacity-0 group-hover/th:opacity-40 transition-opacity" :class="sortKey === 'data' && 'opacity-100'">{{ sortKey === 'data' && sortOrder === 'asc' ? 'arrow_upward' : sortKey === 'data' && sortOrder === 'desc' ? 'arrow_downward' : 'swap_vert' }}</span></span>
                  </th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/20">
                <tr v-for="processo in filteredProcessos" :key="processo.id" @click="abrirProcesso(processo.id!)"
                  class="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td class="px-lg py-md">
                    <div class="flex items-center gap-md">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        :style="{ backgroundColor: getIconColor(processo.tipoAto) + '20' }">
                        <span class="material-symbols-outlined text-base"
                          :style="{ color: getIconColor(processo.tipoAto) }">
                          description
                        </span>
                      </div>
                      <div>
                        <p class="text-label-md font-bold text-primary group-hover:text-secondary transition-colors">
                          {{ processo.tipoAto }}
                        </p>
                        <p class="text-label-sm text-on-surface-variant">{{ processo.protocolo || 'Sem protocolo' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-lg py-md text-label-md text-on-surface-variant">
                    {{ getClientName(processo.partes.apresentante || '') }}
                  </td>
                  <td class="px-lg py-md text-label-md text-on-surface-variant">
                    {{ processo.partes.outorganteComprador}}
                  </td>
                  <td class="px-lg py-md text-label-md font-mono text-on-surface-variant">
                    {{ processo.protocolo || '---' }}
                  </td>
                  <td class="px-lg py-md">
                    <span v-if="processo.statusHistory?.[0]?.status"
                      class="px-md py-xs rounded-full text-label-sm font-label-sm flex items-center w-fit gap-xs"
                      :class="[getStatusInfo(processo.statusHistory[0].status).bg, getStatusInfo(processo.statusHistory[0].status).text]">
                      <span class="material-symbols-outlined text-sm">{{
                        getStatusInfo(processo.statusHistory[0].status).icon }}</span>
                      {{ getStatusInfo(processo.statusHistory[0].status).label }}
                    </span>
                  </td>
                  <td class="px-lg py-md text-right text-label-sm text-on-surface-variant">
                    {{ formatDate(processo.criadoEm) }}
                  </td>
                  <td class="px-lg py-md text-right">
                    <div class="flex items-center justify-end gap-sm">
                      <button @click="editarProcesso(processo.id!, $event)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer" title="Editar">
                        <span class="material-symbols-outlined text-base text-on-surface-variant">edit</span>
                      </button>
                      <button @click="excluirProcesso(processo.id!, $event)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer" title="Excluir">
                        <span class="material-symbols-outlined text-base text-on-surface-variant">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredProcessos.length > 0" class="md:hidden flex flex-col divide-y divide-outline-variant/20">
            <router-link v-for="processo in filteredProcessos" :key="processo.id" :to="`/app/processos/${processo.id}`"
              class="p-lg flex flex-col gap-md hover:bg-surface-container-low transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    :style="{ backgroundColor: getIconColor(processo.tipoAto) + '20' }">
                    <span class="material-symbols-outlined text-base"
                      :style="{ color: getIconColor(processo.tipoAto) }">
                      description
                    </span>
                  </div>
                  <div>
                    <p class="text-label-md font-bold text-primary">{{ processo.tipoAto }}</p>
                    <p class="text-label-sm text-on-surface-variant">{{ formatDate(processo.criadoEm) }}</p>
                  </div>
                </div>
                <span v-if="processo.statusHistory?.[0]?.status"
                  class="px-sm py-xs rounded-full text-label-sm font-label-sm"
                  :class="[getStatusInfo(processo.statusHistory[0].status).bg, getStatusInfo(processo.statusHistory[0].status).text]">
                  {{ getStatusInfo(processo.statusHistory[0].status).label }}
                </span>
              </div>
            </router-link>
          </div>

          <div v-if="filteredProcessos.length > 0"
            class="px-lg py-md bg-surface-bright flex flex-col sm:flex-row justify-between items-center gap-md">
            <p class="text-label-sm text-on-surface-variant">Mostrando {{ filteredProcessos.length }} processos</p>
          </div>
        </div>

      </div>
    </main>

    <div
      v-if="showModal"
      class="fixed z-50 inset-0 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen p-2.5">
        <div class="fixed inset-0 bg-black/50 transition-opacity" @click="showModal = false"></div>

        <div class="relative z-50 bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all w-full mx-2.5">
          <div class="bg-white px-2xl py-2xl">
            <h3 class="text-headline-md font-serif font-bold text-primary mb-xl">Novo Processo</h3>
            <div class="space-y-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Protocolo (opcional)</label>
                  <input v-model="novoProcesso.protocolo" type="text" placeholder="Protocolo" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
                </div>
                <div>
                  <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Tipo de Ato</label>
                  <select v-model="novoProcesso.tipoAto" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md bg-white">
                    <option value="" disabled>Selecione um tipo</option>
                    <option v-for="tipo in tiposAto" :key="tipo" :value="tipo">{{ tipo }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Data de Entrada</label>
                  <input v-model="novoProcesso.dataEntrada" type="date" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
                </div>
                <div>
                  <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Apresentante</label>
                  <select v-model="novoProcesso.partes.apresentante" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md bg-white">
                    <option value="" disabled>Selecione</option>
                    <option v-for="cliente in clientesStore.clientes" :key="cliente.id" :value="cliente.id">{{ cliente.nome }}</option>
                  </select>
                </div>
              </div>

              <div class="border-t border-outline-variant/30 pt-lg">
                <h4 class="text-body-md font-serif font-bold text-primary mb-md">Partes Envolvidas</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div>
                    <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Outorgante Vendedor</label>
                    <input v-model="novoProcesso.partes.outorganteVendedor" type="text" placeholder="Vendedor" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
                  </div>
                  <div>
                    <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Outorgante Comprador</label>
                    <input v-model="novoProcesso.partes.outorganteComprador" type="text" placeholder="Comprador" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
                  </div>
                </div>
              </div>

              <div class="border-t border-outline-variant/30 pt-lg">
                <h4 class="text-body-md font-serif font-bold text-primary mb-md">Valores</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div>
                    <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Valor do Processo</label>
                    <input v-model="valorProcessoInput" @blur="onBlurValorProcesso" type="text" placeholder="R$ 0,00" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
                  </div>
                  <div>
                    <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Valor dos Emolumentos</label>
                    <input v-model="valorEmolumentosInput" @blur="onBlurValorEmolumentos" type="text" placeholder="R$ 0,00" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Notas Internas</label>
                <textarea v-model="novoProcesso.notasInternas" rows="3" placeholder="Notas internas" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md"></textarea>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-low px-2xl py-md flex flex-row-reverse gap-md">
            <button @click="salvarProcesso" type="button" class="w-full sm:w-auto bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:shadow-lg transition-all cursor-pointer">
              Salvar
            </button>
            <button @click="showModal = false" type="button" class="w-full sm:w-auto border border-outline-variant text-primary px-lg py-sm rounded-lg font-label-md hover:bg-surface-container transition-all cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>