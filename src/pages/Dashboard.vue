<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useProcessosStore } from '../stores/processos';
import { useAuthStore } from '../stores/auth';

const processosStore = useProcessosStore();
const authStore = useAuthStore();

onMounted(() => {
  processosStore.fetchProcessos();
});

const processos = computed(() => processosStore.processos);

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
    const criado = new Date(formatDate(p.criadoEm));
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
    const criado = new Date(formatDate(p.criadoEm));
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

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  'Entrada': { label: 'Entrada', bg: 'bg-secondary-container/30', text: 'text-secondary' },
  'Em análise': { label: 'Em Análise', bg: 'bg-blue-100', text: 'text-blue-700' },
  'Falta de documento': { label: 'Pendente', bg: 'bg-orange-100', text: 'text-orange-700' },
  'Indeferido': { label: 'Indeferido', bg: 'bg-error-container/50', text: 'text-error' },
  'Aguardando assinatura': { label: 'Assinatura', bg: 'bg-tertiary-container/30', text: 'text-green-700' },
  'Documentação entregue ao cliente': { label: 'Entregue', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'Concluído / Registrado': { label: 'Concluído', bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};

function getStatusInfo(status: string) {
  return statusConfig[status] ?? { label: status, bg: 'bg-surface-container', text: 'text-on-surface-variant' };
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
  <div class="bg-background min-h-screen">
    <main class="pb-24 md:pb-8">
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        
        <section class="flex flex-col md:flex-row md:items-end justify-between mb-stack-lg gap-md">
          <div>
            <h1 class="text-headline-lg font-serif font-bold text-primary mb-2">
              Olá, Assessor
            </h1>
            <p class="text-body-md text-on-surface-variant">
              Bem-vindo ao seu painel de controle notarial. Você tem <span class="font-semibold text-primary">{{ processosAbertos }}</span> processos ativos.
            </p>
          </div>
          <router-link
            to="/processos/novo"
            class="hidden md:flex bg-primary text-on-primary px-xl py-md rounded-xl font-label-md items-center gap-xs hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <span class="material-symbols-outlined">add</span>
            Novo Processo
          </router-link>
        </section>

        <section v-if="authStore.userRole === 'escrevente'" class="mb-stack-lg">
          <div class="bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/30 rounded-xl p-lg">
            <div class="flex items-center gap-sm mb-md">
              <span class="material-symbols-outlined text-secondary">payments</span>
              <h3 class="text-headline-md font-serif font-bold text-primary">Minhas Comissões</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <p class="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Apresentante</p>
                <p class="text-body-lg font-bold text-primary">
                  {{ totalComissaoApresentante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                </p>
              </div>
              <div>
                <p class="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Escrevente</p>
                <p class="text-body-lg font-bold text-primary">
                  {{ totalComissaoEscrevente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-2 lg:grid-cols-4 gap-md md:gap-lg mb-3xl">
          <div class="glass-card p-lg rounded-xl flex flex-col gap-sm hover:shadow-lg transition-all cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-on-secondary-fixed-variant">account_tree</span>
            </div>
            <div>
              <p class="text-label-sm text-on-surface-variant uppercase tracking-wider">Processos Abertos</p>
              <h3 class="text-headline-md font-serif font-bold mt-base text-primary">{{ String(processosAbertos).padStart(2, '0') }}</h3>
            </div>
            <div v-if="hoje > 0" class="flex items-center gap-xs text-sm text-emerald-600">
              <span class="material-symbols-outlined text-sm">trending_up</span>
              <span class="font-medium">+{{ hoje }} hoje</span>
            </div>
            <div v-else-if="lastSevenDays > 0" class="flex items-center gap-xs text-sm text-emerald-600">
              <span class="material-symbols-outlined text-sm">trending_up</span>
              <span class="font-medium">+{{ lastSevenDays }} essa semana</span>
            </div>
          </div>

          <div class="glass-card p-lg rounded-xl flex flex-col gap-sm hover:shadow-lg transition-all cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="material-symbols-outlined text-blue-700">draw</span>
            </div>
            <div>
              <p class="text-label-sm text-on-surface-variant uppercase tracking-wider">Assinaturas Pendentes</p>
              <h3 class="text-headline-md font-serif font-bold mt-base text-primary">{{ String(pendentes).padStart(2, '0') }}</h3>
            </div>
            <p class="text-label-sm text-on-surface-variant">Aguardando</p>
          </div>

          <div class="glass-card p-lg rounded-xl flex flex-col gap-sm hover:shadow-lg transition-all cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
              <span class="material-symbols-outlined text-on-surface-variant">description</span>
            </div>
            <div>
              <p class="text-label-sm text-on-surface-variant uppercase tracking-wider">Orçamentos</p>
              <h3 class="text-headline-md font-serif font-bold mt-base text-primary">{{ String(orcamentos).padStart(2, '0') }}</h3>
            </div>
            <p class="text-label-sm text-error font-medium">Não aderiram</p>
          </div>

          <div class="glass-card p-lg rounded-xl flex flex-col gap-sm hover:shadow-lg transition-all cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
              <span class="material-symbols-outlined text-emerald-600">check_circle</span>
            </div>
            <div>
              <p class="text-label-sm text-on-surface-variant uppercase tracking-wider">Concluídos</p>
              <h3 class="text-headline-md font-serif font-bold mt-base text-primary">{{ String(concluidos).padStart(2, '0') }}</h3>
            </div>
            <p class="text-label-sm text-on-surface-variant">Total</p>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          <section class="lg:col-span-2">
            <div class="flex items-center justify-between mb-lg">
              <h3 class="text-headline-md font-serif font-bold text-primary">Atividade Recente</h3>
              <router-link to="/processos" class="text-secondary text-label-md font-label-md hover:underline">
                Ver todos
              </router-link>
            </div>

            <div v-if="processosStore.loading" class="bg-white border border-outline-variant/30 rounded-xl overflow-hidden">
              <div v-for="i in 4" :key="i" class="px-lg py-lg border-b border-outline-variant/10 last:border-b-0">
                <div class="flex items-center gap-sm animate-pulse">
                  <div class="w-10 h-10 bg-surface-container rounded-lg"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-surface-container rounded w-1/3 mb-2"></div>
                    <div class="h-3 bg-surface-container rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="processosRecentes.length > 0" class="bg-white border border-outline-variant/30 rounded-xl overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead class="bg-surface-container-low text-on-surface-variant text-label-sm uppercase tracking-wider">
                  <tr>
                    <th class="px-lg py-md border-b border-outline-variant/20 font-medium">Identificador</th>
                    <th class="px-lg py-md border-b border-outline-variant/20 font-medium hidden md:table-cell">Tipo</th>
                    <th class="px-lg py-md border-b border-outline-variant/20 font-medium">Status</th>
                    <th class="px-lg py-md border-b border-outline-variant/20 text-right font-medium">Data</th>
                  </tr>
                </thead>
                <tbody class="text-body-md">
                  <router-link
                    v-for="processo in processosRecentes"
                    :key="processo.id"
                    :to="`/processos/${processo.id}`"
                    class="hover:bg-surface-container-low transition-colors group cursor-pointer block"
                    tag="tr"
                  >
                    <td class="px-lg py-lg border-b border-outline-variant/10 group-hover:bg-surface-container-low">
                      <div class="flex items-center gap-sm">
                        <div
                          class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          :style="{ backgroundColor: getIconColor(processo.tipoAto) + '20' }"
                        >
                          <span class="material-symbols-outlined text-base" :style="{ color: getIconColor(processo.tipoAto) }">description</span>
                        </div>
                        <div class="min-w-0">
                          <p class="font-bold text-primary truncate">{{ processo.tipoAto }}</p>
                          <p class="text-label-sm text-on-surface-variant">Prot. {{ processo.protocolo || 'N/A' }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-lg py-lg border-b border-outline-variant/10 hidden md:table-cell text-on-surface-variant">
                      {{ processo.tipoAto }}
                    </td>
                    <td class="px-lg py-lg border-b border-outline-variant/10">
                      <span
                        v-if="processo.statusHistory?.[0]?.status"
                        class="px-md py-1 rounded-full text-label-sm font-label-sm"
                        :class="[getStatusInfo(processo.statusHistory[0].status).bg, getStatusInfo(processo.statusHistory[0].status).text]"
                      >
                        {{ getStatusInfo(processo.statusHistory[0].status).label }}
                      </span>
                    </td>
                    <td class="px-lg py-lg border-b border-outline-variant/10 text-right text-label-sm text-on-surface-variant">
                      {{ formatDateSimple(processo.criadoEm) }}
                    </td>
                  </router-link>
                </tbody>
              </table>
            </div>

            <div v-else class="bg-white border border-outline-variant/30 rounded-xl p-xl text-center">
              <div class="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span class="material-symbols-outlined text-on-surface-variant">description</span>
              </div>
              <p class="text-primary font-semibold">Nenhum processo ainda</p>
              <p class="text-on-surface-variant text-body-sm mt-1">Crie o primeiro processo clicando abaixo</p>
            </div>
          </section>

          <aside class="space-y-lg">
            <div>
              <h3 class="text-headline-md font-serif font-bold text-primary mb-lg">Atalhos Rápidos</h3>
              <div class="grid grid-cols-1 gap-md">
                <router-link
                  to="/processos"
                  class="flex items-center gap-md p-md bg-white border border-outline-variant/30 rounded-xl hover:shadow-md transition-all group"
                >
                  <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span class="material-symbols-outlined">search</span>
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-label-md text-primary">Buscar Processo</p>
                    <p class="text-label-sm text-on-surface-variant">Localize por ID ou nome</p>
                  </div>
                </router-link>

                <router-link
                  to="/clientes"
                  class="flex items-center gap-md p-md bg-white border border-outline-variant/30 rounded-xl hover:shadow-md transition-all group"
                >
                  <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span class="material-symbols-outlined">groups</span>
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-label-md text-primary">Novo Cliente</p>
                    <p class="text-label-sm text-on-surface-variant">Cadastrar pessoa ou empresa</p>
                  </div>
                </router-link>
              </div>
            </div>

            <div class="p-lg rounded-xl bg-primary text-white relative overflow-hidden">
              <div class="relative z-10">
                <h4 class="text-headline-md font-serif font-bold mb-sm">Upgrade para Premium</h4>
                <p class="text-body-sm opacity-90 mb-lg">
                  Acesse automação de minutas via IA e integração direta com o e-Notariado.
                </p>
                <button class="bg-secondary text-primary px-lg py-md rounded-lg font-bold hover:scale-105 transition-transform text-label-md">
                  Saiba Mais
                </button>
              </div>
              <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white opacity-5 rotate-12 rounded-2xl"></div>
              <div class="absolute -right-4 -bottom-4 w-32 h-32 bg-white opacity-10 rotate-45 rounded-3xl"></div>
            </div>
          </aside>
        </div>

      </div>
    </main>

    <div class="md:hidden fixed bottom-18 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/30 px-margin-mobile py-md flex gap-md shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <router-link
        to="/processos/novo"
        class="flex-1 bg-primary text-on-primary rounded-xl py-md flex items-center justify-center gap-xs font-label-md active:scale-95 transition-transform"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Novo Processo
      </router-link>

      <router-link
        to="/processos"
        class="flex-1 border border-outline-variant/50 text-primary rounded-xl py-md flex items-center justify-center gap-xs font-label-md active:scale-95 transition-transform"
      >
        <span class="material-symbols-outlined text-sm">search</span>
        Buscar
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.glass-card:hover {
  -webkit-transform: translateY(-2px);
  transform: translateY(-2px);
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>