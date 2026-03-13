<script setup lang="ts">
import { ref, computed } from 'vue';
import StatusBadge from './StatusBadge.vue';

interface StatusHistory {
  id: string;
  status: string;
  data: any; // Timestamp or string
  observacao?: string;
}

const props = defineProps<{
  history: StatusHistory[];
  isPublic?: boolean;
  processoId: string; // Adicionar esta linha
}>();

const emit = defineEmits(['remove-status']); // Adicionar esta linha

const showAll = ref(false);

const sortedHistory = computed(() => {
  // Ordena por data decrescente se necessário, assumindo que já vem ordenado ou tratar aqui
  return props.history;
});

const latestStatus = computed(() => sortedHistory.value[0]);
const previousStatus = computed(() => {
    if (showAll.value) return sortedHistory.value.slice(1);
    return sortedHistory.value.slice(1, 4); // Últimos 3 (excluindo o atual)
});

const formatDate = (date: any) => {
    if (!date) return '';
    // Tratamento para Timestamp do Firestore ou string ISO
    const d = new Date(date._seconds ? date._seconds * 1000 : date); 
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="space-y-6">
    <!-- Status Mais Recente -->
    <div v-if="latestStatus" class="bg-[#C9A84C]/20 border-l-4 border-[#C9A84C] p-6 rounded-r-lg shadow-sm">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-xl font-serif text-[#1B2A4A] font-bold">Status Atual</h3>
        <span class="text-sm text-[#1B2A4A]/70">{{ formatDate(latestStatus.data) }}</span>
      </div>
      <div class="mb-4">
        <StatusBadge :status="latestStatus.status" />
      </div>
      <p v-if="latestStatus.observacao" class="text-[#1B2A4A] bg-white/50 p-3 rounded-md italic">
        "{{ latestStatus.observacao }}"
      </p>
    </div>

    <!-- Histórico Anterior -->
    <div class="space-y-4">
      <div v-for="status in previousStatus" :key="status.id" class="bg-[#1B2A4A]/5 border-l-4 border-[#1B2A4A]/20 p-4 rounded-r-lg">
        <div class="flex justify-between items-center mb-2">
           <StatusBadge :status="status.status" />
           <div class="flex items-center space-x-2">
               <span class="text-xs text-[#6B7280]">{{ formatDate(status.data) }}</span>
               <button v-if="!isPublic" @click.stop="emit('remove-status', status.id)" class="text-red-500 hover:text-red-700 text-xs">
                   Remover
               </button>
           </div>
        </div>
        <p v-if="status.observacao" class="text-sm text-[#6B7280] mt-1">
          {{ status.observacao }}
        </p>
      </div>
    </div>

    <!-- Botão Ver Mais -->
    <button 
      v-if="sortedHistory.length > 4 && !showAll" 
      @click="showAll = true" 
      class="w-full text-center text-[#C9A84C] hover:text-[#1B2A4A] transition-colors text-sm font-medium py-2"
    >
      Ver histórico completo
    </button>
  </div>
</template>
