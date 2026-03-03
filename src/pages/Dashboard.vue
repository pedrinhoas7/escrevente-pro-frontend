<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProcessosStore } from '../stores/processos';

const processosStore = useProcessosStore();

onMounted(() => {
  processosStore.fetchProcessos();

});

const processos = computed(() => processosStore.processos);


console.log(processos)
// Contadores dos cards
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

console.log(processos.value)

const indeferidos = computed(() =>
  processos.value.filter(p =>
    p.statusHistory?.[0]?.status === 'Indeferido'
  ).length
);

const concluidos = computed(() =>
  processos.value.filter(p =>
    p.statusHistory?.[0]?.status === 'Concluído / Registrado'
  ).length
);

// Processos recentes (últimos 4)
const processosRecentes = computed(() =>
  [...processos.value]
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 4)
);

// Configuração dos status
const statusConfig: Record<string, { label: string; cor: string; textCor: string }> = {
  'Entrada':                            { label: 'Entrada',      cor: 'bg-[#EFF6FF]', textCor: 'text-[#3B82F6]' },
  'Em análise':                         { label: 'Análise',      cor: 'bg-[#FFFBEB]', textCor: 'text-[#F59E0B]' },
  'Falta de documento':                 { label: 'Pendente',     cor: 'bg-[#FFF7ED]', textCor: 'text-[#F97316]' },
  'Indeferido':                         { label: 'Indeferido',   cor: 'bg-[#FEF2F2]', textCor: 'text-[#EF4444]' },
  'Aguardando assinatura':              { label: 'Pendente',     cor: 'bg-[#FFF7ED]', textCor: 'text-[#F97316]' },
  'Documentação entregue ao cliente':   { label: 'Entregue',     cor: 'bg-[#F0FDFA]', textCor: 'text-[#14B8A6]' },
  'Concluído / Registrado':             { label: 'Concluído',    cor: 'bg-[#F0FDF4]', textCor: 'text-[#22C55E]' },
};

function getStatusInfo(status: string) {
  return statusConfig[status] ?? { label: status, cor: 'bg-[#F3F4F6]', textCor: 'text-[#6B7280]' };
}

// Ícone por tipo de ato
function getIconColor(tipoAto: string): string {
  const map: Record<string, string> = {
    'escritura':     '#3B82F6',
    'procuração':    '#F59E0B',
    'inventário':    '#8B5CF6',
    'reconhecimento':'#22C55E',
    'ata':           '#EF4444',
  };
  const key = Object.keys(map).find(k => tipoAto?.toLowerCase().includes(k));
  return key ? map[key] : '#C9A84C';
}

const formatDate = (date: any) => {
    if (!date) return '';
    // Tratamento para Timestamp do Firestore ou string ISO
    const d = new Date(date._seconds ? date._seconds * 1000 : date); 
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="min-h-screen bg-[#F8F7F4] ">

    <main class=" -mt-14">

      <!-- Cards de resumo -->
      <div class="grid grid-cols-2 gap-3 mb-6">

        <!-- Processos Abertos -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-[#1B2A4A]/8">
          <div class="flex items-start justify-between">
            <p class="text-[#6B7280] text-xs font-medium leading-tight">Processos<br>Abertos</p>
            <div class="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p class="text-[#1B2A4A] text-3xl font-bold  mt-3">{{ String(processosAbertos).padStart(2, '0') }}</p>
          <div class="flex items-center gap-1 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span class="text-[#22C55E] text-xs font-medium">+2 hoje</span>
          </div>
        </div>

        <!-- Pendentes -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-[#1B2A4A]/8">
          <div class="flex items-start justify-between">
            <p class="text-[#6B7280] text-xs font-medium leading-tight">Pendentes</p>
            <div class="w-7 h-7 rounded-full bg-[#FFF7ED] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-[#F97316] text-3xl font-bold  mt-3">{{ String(pendentes).padStart(2, '0') }}</p>
          <p class="text-[#6B7280] text-xs mt-1">Aguardando assinatura</p>
        </div>

        <!-- Indeferidos -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-[#EF4444]/20">
          <div class="flex items-start justify-between">
            <p class="text-[#6B7280] text-xs font-medium leading-tight">Indeferidos</p>
            <div class="w-7 h-7 rounded-full bg-[#FEF2F2] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p class="text-[#1B2A4A] text-3xl font-bold  mt-3">{{ String(indeferidos).padStart(2, '0') }}</p>
          <p class="text-[#EF4444] text-xs mt-1 font-medium">Requer atenção</p>
        </div>

        <!-- Concluídos -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-[#1B2A4A]/8">
          <div class="flex items-start justify-between">
            <p class="text-[#6B7280] text-xs font-medium leading-tight">Concluídos</p>
            <div class="w-7 h-7 rounded-full bg-[#F0FDF4] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-[#1B2A4A] text-3xl font-bold  mt-3">{{ String(concluidos).padStart(2, '0') }}</p>
          <p class="text-[#6B7280] text-xs mt-1">Total</p>
        </div>

      </div>

      <!-- Processos Recentes -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-[#1B2A4A] text-base  font-bold">Processos Recentes</h2>
          <router-link to="/processos" class="text-[#C9A84C] text-sm font-medium">
            Ver todos &rsaquo;
          </router-link>
        </div>

        <!-- Loading -->
        <div v-if="processosStore.loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#F3F4F6] rounded-xl"></div>
              <div class="flex-1">
                <div class="h-3.5 bg-[#F3F4F6] rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-[#F3F4F6] rounded w-1/2"></div>
              </div>
              <div class="h-6 w-16 bg-[#F3F4F6] rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- Lista -->
        <div v-else-if="processosRecentes.length > 0" class="space-y-2">
          <router-link
            v-for="processo in processosRecentes"
            :key="processo.id"
            :to="`/processos/${processo.id}`"
            class="block bg-white rounded-2xl p-4 shadow-sm border border-[#1B2A4A]/8 active:scale-[0.98] transition-transform"
          >
            <div class="flex items-center gap-3">
              <!-- Ícone tipo ato -->
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: getIconColor(processo.tipoAto) + '18' }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :style="{ color: getIconColor(processo.tipoAto) }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-[#1B2A4A] text-sm font-semibold truncate">{{ processo.titulo }}</p>
                <p class="text-[#6B7280] text-xs mt-0.5">
                  Prot. {{ processo.protocolo }} &bull; {{ formatDate(processo.criadoEm) }}
                </p>
              </div>

              <!-- Badge status -->
              <span
                v-if="processo.statusHistory?.[0]?.status"
                class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                :class="[getStatusInfo(processo.statusHistory[0].status).cor, getStatusInfo(processo.statusHistory[0].status).textCor]"
              >
                {{ getStatusInfo(processo.statusHistory[0].status).label }}
              </span>
            </div>
          </router-link>
        </div>

        <!-- Vazio -->
        <div v-else class="bg-white rounded-2xl p-8 text-center border border-[#1B2A4A]/8">
          <div class="w-14 h-14 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-[#1B2A4A] font-semibold text-sm">Nenhum processo ainda</p>
          <p class="text-[#6B7280] text-xs mt-1">Crie o primeiro processo clicando abaixo</p>
        </div>
      </div>

    </main>

    <!-- Bottom Bar fixa -->
    <div class="fixed bottom-18 left-0 right-0 bg-transparent px-4 py-3 flex gap-3 ">
      <router-link
        to="/processos/novo"
        class="flex-1 bg-[#1B2A4A] text-[#C9A84C] rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-sm active:scale-[0.97] transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Novo Processo
      </router-link>

      <router-link
        to="/processos"
        class="flex-1 border border-[#1B2A4A]/20 text-[#1B2A4A] rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-sm active:scale-[0.97] transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar
      </router-link>
    </div>

  </div>
</template>