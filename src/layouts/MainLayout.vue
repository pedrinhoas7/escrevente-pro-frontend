<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppMenu from '../components/AppMenu.vue'
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
  <div class="bg-background min-h-screen">
    <AppHeader />
    <AppMenu />
    <main class="pt-16 md:ml-[280px]">
      <RouterView />
    </main>
  </div>
</template>
