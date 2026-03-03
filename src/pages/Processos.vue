<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProcessosStore } from '../stores/processos'
import { useClientesStore } from '../stores/clientes'
import ProcessoCard from '../components/ProcessoCard.vue'

const processosStore = useProcessosStore()
const clientesStore = useClientesStore()

const searchTerm = ref('')

onMounted(() => {
  processosStore.fetchProcessos()
  clientesStore.fetchClientes()
})

const getClientName = (clientId: string) => {
  const client = clientesStore.clientes.find(c => c.id === clientId)
  return client ? client.nome : 'Cliente não encontrado'
}

const filteredProcessos = computed(() => {
  const sortedProcessos = [...processosStore.processos].sort((a, b) => {
    const aDate = a.statusHistory?.[a.statusHistory.length - 1]?.timestamp?._seconds || 0
    const bDate = b.statusHistory?.[b.statusHistory.length - 1]?.timestamp?._seconds || 0
    return bDate - aDate
  })

  if (!searchTerm.value) {
    return sortedProcessos
  }

  return sortedProcessos.filter(
    processo =>
      processo.titulo.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      processo.protocolo.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      getClientName(processo.clienteId).toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <h1 class="text-3xl font-serif font-bold text-[#1B2A4A]">Gestão de Processos</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Pesquisar..."
            class="
              w-full md:w-64 pl-10 pr-4 py-2 h-12
              border border-gray-200 rounded-lg
              focus:ring-yellow-500 focus:border-yellow-500
              transition-shadow shadow-sm
            "
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <router-link
          to="/processos/novo"
          class="btn-primary h-12 w-full md:w-auto text-center"
        >
          Novo Processo
        </router-link>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Table Header -->
      <div class="hidden md:grid grid-cols-4 gap-4 p-6 border-b border-gray-200">
        <div class="font-bold text-gray-500 uppercase text-sm tracking-wider">Processo</div>
        <div class="font-bold text-gray-500 uppercase text-sm tracking-wider">Cliente</div>
        <div class="font-bold text-gray-500 uppercase text-sm tracking-wider">Status</div>
        <div class="font-bold text-gray-500 uppercase text-sm tracking-wider text-right">Última Atualização</div>
      </div>

      <div v-if="processosStore.loading" class="text-center p-10">
        <p class="text-[#1B2A4A]">Carregando processos...</p>
      </div>

      <div v-else-if="filteredProcessos.length === 0" class="text-center p-10">
        <p class="text-gray-500">Nenhum processo encontrado.</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <ProcessoCard
          v-for="processo in filteredProcessos"
          :key="processo.id"
          :processo="processo"
          :clientName="getClientName(processo.clienteId)"
        />
      </div>
    </div>
  </div>
</template>
