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
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <div v-if="isDashboard" class="brand">
          <div class="brand-icon">
            <span class="material-symbols-outlined brand-icon-text">description</span>
          </div>
          <div class="brand-text">
            <h2 class="brand-title">Cartorial Tech</h2>
            <p class="brand-subtitle">Sistema Notarial</p>
          </div>
        </div>
        <button v-else @click="goBack" class="back-button">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
      </div>
      
      <div class="header-right">
        <div v-if="isDashboard" class="nav-links">
          <span class="nav-link active">Dashboard</span>
          <router-link to="/clientes" class="nav-link">Clientes</router-link>
          <router-link to="/processos" class="nav-link">Processos</router-link>
        </div>
        <div class="user-avatar">
          <span class="material-symbols-outlined user-icon">person</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Caslon+Text:wght@400;700&display=swap');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

.app-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background-color: rgba(250, 249, 246, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(197, 198, 208, 0.3);
  height: 64px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 24px;
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #112752;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon-text {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  color: white;
}

.brand-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 14px;
  font-weight: 700;
  color: #112752;
  margin: 0;
}

.brand-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #44464f;
  margin: 0;
}

.back-button {
  padding: 8px;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: background-color 0.2s;
  border-radius: 8px;
  color: #44464f;
}

.back-button:hover {
  background-color: #f4f3f0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-links {
  display: none;
  gap: 32px;
  margin-right: 32px;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #44464f;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #1a1c1a;
}

.nav-link.active {
  color: #CFB53B;
  font-weight: 700;
  border-bottom: 2px solid #CFB53B;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #c5c6d0;
  background-color: #e9e8e5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-icon {
  font-size: 16px;
  color: #44464f;
}
</style>