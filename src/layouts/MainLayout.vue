<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppMenu from '../components/AppMenu.vue'
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
  <div class="main-layout">
    <AppHeader />
    <AppMenu />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  background-color: #faf9f6;
  min-height: 100vh;
}

.main-content {
  padding-top: 64px;
}

@media (min-width: 768px) {
  .main-content {
    margin-left: 280px;
  }
}
</style>