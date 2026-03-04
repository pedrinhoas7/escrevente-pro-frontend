<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isDashboard = computed(() => route.name === 'Dashboard')

const goBack = () => {
  router.back()
}

function formatRouteName(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
}
</script>

<template>
  <header class="sticky top-0 z-10 bg-white shadow-md md:hidden">
    <!-- Dashboard Header -->
    <div v-if="isDashboard">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center">
          <span class="material-symbols-outlined">gavel</span>
          <div class="ml-3">
            <p class="text-md font-bold text-[#1b2a4b]">Escrevente Pro</p>
            <p class="text-sm font-normal text-gray-900">Cartório Souza Martins</p>
          </div>

        </div>
      </div>
    </div>

    <!-- Other Pages Header -->
    <div v-else class="flex items-center p-4">
      <button @click="goBack" class="mr-4 text-gray-500">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <h1 class="text-lg font-bold text-gray-900">{{ formatRouteName(String(route.name)) }}</h1>
    </div>
  </header>
</template>
