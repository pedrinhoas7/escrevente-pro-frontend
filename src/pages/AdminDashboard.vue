<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchMetrics()
})
</script>

<template>
  <div class="bg-background min-h-screen pb-24 px-3 mr-4 md:pb-8">
    <main>
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">

        <div class="mb-xl">
          <h1 class="text-headline-lg font-serif font-bold text-primary mb-2">Painel Administrativo</h1>
          <p class="text-body-md text-on-surface-variant">Visão geral do sistema e gestão de usuários.</p>
        </div>

        <div v-if="!adminStore.metrics" class="flex flex-col items-center justify-center py-xl gap-md">
          <div class="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p class="text-on-surface-variant">Carregando métricas...</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total de Usuários</span>
            <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalUsuarios }}</span>
            <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
              <span class="material-symbols-outlined text-base">groups</span>
              <span>No sistema</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Cartórios</span>
            <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalCartorios }}</span>
            <div class="flex items-center gap-xs text-secondary text-label-sm">
              <span class="material-symbols-outlined text-base">business</span>
              <span>Cadastrados</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Escreventes</span>
            <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalEscreventes }}</span>
            <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
              <span class="material-symbols-outlined text-base">badge</span>
              <span>Ativos</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pendentes</span>
            <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalPendentes }}</span>
            <div class="flex items-center gap-xs text-orange-700 text-label-sm">
              <span class="material-symbols-outlined text-base">mail</span>
              <span>Aguardando cadastro</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total de Processos</span>
            <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalProcessos }}</span>
            <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
              <span class="material-symbols-outlined text-base">account_tree</span>
              <span>No sistema</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total de Clientes</span>
            <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalClientes }}</span>
            <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
              <span class="material-symbols-outlined text-base">groups</span>
              <span>Cadastrados</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>