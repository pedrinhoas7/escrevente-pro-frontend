<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isDashboard = computed(() => route.name === 'Dashboard')

const goBack = () => {
  router.back()
}
</script>

<template>
  <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 h-16">
    <div class="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-full">
      <div class="flex items-center gap-md">
        <div v-if="isDashboard" class="flex items-center gap-sm">
          <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">description</span>
          </div>
          <div>
            <h2 class="text-label-md font-bold text-primary">Cartorial Tech</h2>
            <p class="text-label-sm text-on-surface-variant">Sistema Notarial</p>
          </div>
        </div>
        <button v-else @click="goBack" class="p-xs hover:bg-surface-container-low transition-all text-on-surface-variant">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
      </div>
      
      <div class="flex items-center gap-md">
        <div v-if="isDashboard" class="hidden md:flex gap-lg mr-lg">
          <span class="text-secondary font-bold border-b-2 border-secondary text-label-md">Dashboard</span>
          <router-link to="/clientes" class="text-on-surface-variant hover:text-on-surface transition-colors text-label-md">Clientes</router-link>
          <router-link to="/processos" class="text-on-surface-variant hover:text-on-surface transition-colors text-label-md">Processos</router-link>
        </div>
        <div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high flex items-center justify-center">
          <span class="material-symbols-outlined text-on-surface-variant text-sm">person</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>
