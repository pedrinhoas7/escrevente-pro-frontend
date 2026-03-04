<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppMenu from '../components/AppMenu.vue'
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
  <div class="bg-[#F8F7F4] min-h-dvh">
    <AppHeader />
    <AppMenu />
    <main class="pt-16 md:pt-0 pb-16 md:pb-0 md:ml-64">
      <div class="p-4 md:p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>
