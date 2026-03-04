<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import type { Processo } from '../stores/processos'

const props = defineProps<{
  processo: Processo
  clientName: string
}>()

const router = useRouter()

const irParaDetalhes = () => {
  router.push(`/processos/${props.processo.id}`)
}

const lastStatus = computed(() => {
  if (!props.processo.statusHistory || props.processo.statusHistory.length === 0) {
    return { status: 'Entrada', date: props.processo.dataEntrada }
  }
  const last = props.processo.statusHistory[props.processo.statusHistory.length - 1]
  return {
    status: last.status,
    date: last.timestamp,
  }
})

const formattedDate = computed(() => {
    if (!lastStatus.value.date?._seconds) return 'N/A'
    return new Date(lastStatus.value.date._seconds * 1000).toLocaleDateString()
})
</script>

<template>
  <div
    class="hover:bg-gray-50 transition-colors cursor-pointer"
    @click="irParaDetalhes"
  >
    <!-- Desktop Row -->
    <div class="hidden md:grid grid-cols-4 gap-4 items-center p-6">
      <div>
        <p class="font-bold text-gray-800">{{ props.processo.tipoAto.nome }}</p>
        <p class="text-sm text-gray-500">#{{ props.processo.protocolo }}</p>
      </div>
      <div>
        <p class="text-gray-700">{{ props.clientName }}</p>
      </div>
      <div>
        <StatusBadge :status="lastStatus.status" />
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-500">{{ formattedDate }}</p>
      </div>
    </div>
    
    <!-- Mobile Card -->
    <div class="md:hidden p-6 space-y-4">
        <div class="flex justify-between items-start">
            <div>
                <p class="font-bold text-gray-800">{{ props.processo.tipoAto.nome }}</p>
                <p class="text-sm text-gray-500">#{{ props.processo.protocolo }}</p>
            </div>
            <StatusBadge :status="lastStatus.status" />
        </div>
        <div class="flex justify-between items-baseline text-sm">
            <span class="font-bold text-gray-500">Cliente:</span>
            <p class="text-gray-700">{{ props.clientName }}</p>
        </div>
        <div class="flex justify-between items-baseline text-sm">
            <span class="font-bold text-gray-500">Última Atualização:</span>
            <p class="text-gray-500">{{ formattedDate }}</p>
        </div>
    </div>
  </div>
</template>

