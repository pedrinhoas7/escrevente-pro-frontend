<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const isRouteActive = (path: string) => route.path.startsWith(path)

const getIconStyle = (isActive: boolean) => {
  return isActive ? 'font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;' : ''
}
</script>

<template>
  <aside class="hidden md:flex flex-col p-md gap-base h-full w-[280px] fixed left-0 top-0 z-40 bg-surface border-r border-outline-variant/30 mt-16">
    <nav class="space-y-base mt-md">
      <RouterLink
        to="/dashboard"
        class="flex items-center gap-md px-md py-sm rounded-lg font-bold transition-all"
        :class="isRouteActive('/dashboard') ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'"
      >
        <span class="material-symbols-outlined">dashboard</span>
        <span class="text-label-md font-label-md">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/clientes"
        class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container transition-all rounded-lg"
        :class="isRouteActive('/clientes') ? 'bg-surface-container font-bold' : ''"
      >
        <span class="material-symbols-outlined">groups</span>
        <span class="text-label-md font-label-md">Clientes</span>
      </RouterLink>

      <RouterLink
        to="/processos"
        class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container transition-all rounded-lg"
        :class="isRouteActive('/processos') ? 'bg-surface-container font-bold' : ''"
      >
        <span class="material-symbols-outlined">account_tree</span>
        <span class="text-label-md font-label-md">Processos</span>
      </RouterLink>

      <RouterLink
        to="/consulta-protocolo"
        class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container transition-all rounded-lg"
        :class="isRouteActive('/consulta-protocolo') ? 'bg-surface-container font-bold' : ''"
      >
        <span class="material-symbols-outlined">search</span>
        <span class="text-label-md font-label-md">Consultar</span>
      </RouterLink>
    </nav>

    <div class="mt-auto border-t border-outline-variant/20 pt-md">
      <button
        @click="authStore.logout()"
        class="flex items-center gap-md px-md py-sm w-full text-on-surface-variant hover:bg-error-container/20 transition-all rounded-lg"
      >
        <span class="material-symbols-outlined">logout</span>
        <span class="text-label-md font-label-md">Sair</span>
      </button>
    </div>
  </aside>

  <nav class="md:hidden fixed bottom-0 w-full z-50 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/30 h-16 px-4 flex justify-around items-center">
    <RouterLink
      to="/dashboard"
      class="flex flex-col items-center justify-center transition-transform"
      :class="isRouteActive('/dashboard') ? 'text-secondary font-bold scale-110' : 'text-on-surface-variant opacity-70'"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/dashboard'))"
      >
        dashboard
      </span>
      <span class="text-label-sm font-label-sm">Dashboard</span>
    </RouterLink>

    <RouterLink
      to="/clientes"
      class="flex flex-col items-center justify-center transition-transform"
      :class="isRouteActive('/clientes') ? 'text-secondary font-bold scale-110' : 'text-on-surface-variant opacity-70'"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/clientes'))"
      >
        groups
      </span>
      <span class="text-label-sm font-label-sm">Clientes</span>
    </RouterLink>

    <RouterLink
      to="/processos"
      class="flex flex-col items-center justify-center transition-transform"
      :class="isRouteActive('/processos') ? 'text-secondary font-bold scale-110' : 'text-on-surface-variant opacity-70'"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/processos'))"
      >
        account_tree
      </span>
      <span class="text-label-sm font-label-sm">Processos</span>
    </RouterLink>

    <button
      @click="authStore.logout()"
      class="flex flex-col items-center justify-center text-on-surface-variant opacity-70"
    >
      <span class="material-symbols-outlined">logout</span>
      <span class="text-label-sm font-label-sm">Sair</span>
    </button>
  </nav>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>