<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const isRouteActive = (path: string) => route.path.startsWith(path)

const navLinks = [
  {
    to: '/dashboard',
    text: 'Dashboard',
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`,
  },
  {
    to: '/processos',
    text: 'Processos',
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
  },
  {
    to: '/clientes',
    text: 'Clientes',
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`,
  },
]
</script>

<template>
  <!-- Responsive Menu Container -->
  <aside class="
    fixed bottom-0 left-0 right-0 z-10
    md:top-0 md:w-64
    bg-white shadow-[0_-1px_4px_rgba(0,0,0,0.05)] md:shadow-md
  ">
    <!-- Mobile Footer Menu -->
    <nav class="md:hidden h-16">
      <div class="flex justify-around items-center h-full">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex flex-col items-center justify-center text-sm"
          :class="isRouteActive(link.to) ? 'text-yellow-500' : 'text-gray-500'"
        >
          <div v-html="link.icon"></div>
          <span>{{ link.text }}</span>
        </RouterLink>
      </div>
    </nav>

    <!-- Desktop Sidebar Menu -->
    <nav class="hidden md:flex flex-col h-full p-4">
      <div class="flex-shrink-0 mb-10 px-4 py-2">
        <RouterLink to="/dashboard">
          <span class="text-2xl font-bold font-serif text-[#1B2A4A]">Escrevente.pro</span>
        </RouterLink>
      </div>

      <div class="flex-grow">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center px-4 py-3 rounded-lg transition-colors"
          :class="isRouteActive(link.to) ? 'bg-yellow-50 text-yellow-600 font-bold' : 'text-gray-600 hover:bg-gray-100'"
        >
          <div v-html="link.icon" class="mr-3"></div>
          <span>{{ link.text }}</span>
        </RouterLink>
      </div>

      <div class="mt-auto">
        <button @click="authStore.logout()" class="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span>Sair</span>
        </button>
      </div>
    </nav>
  </aside>
</template>