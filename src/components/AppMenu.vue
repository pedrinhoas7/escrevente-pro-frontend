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
  <aside class="desktop-menu">
    <nav class="menu-nav">
      <RouterLink
        to="/dashboard"
        class="menu-item"
        :class="{ 'menu-item-active': isRouteActive('/dashboard') }"
      >
        <span class="material-symbols-outlined">dashboard</span>
        <span class="menu-item-text">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/clientes"
        class="menu-item menu-item-inactive"
        :class="{ 'menu-item-active-bg': isRouteActive('/clientes') }"
      >
        <span class="material-symbols-outlined">groups</span>
        <span class="menu-item-text">Clientes</span>
      </RouterLink>

      <RouterLink
        to="/processos"
        class="menu-item menu-item-inactive"
        :class="{ 'menu-item-active-bg': isRouteActive('/processos') }"
      >
        <span class="material-symbols-outlined">account_tree</span>
        <span class="menu-item-text">Processos</span>
      </RouterLink>

      <RouterLink
        to="/consulta-protocolo"
        class="menu-item menu-item-inactive"
        :class="{ 'menu-item-active-bg': isRouteActive('/consulta-protocolo') }"
      >
        <span class="material-symbols-outlined">search</span>
        <span class="menu-item-text">Consultar</span>
      </RouterLink>
    </nav>

    <div class="menu-footer">
      <button
        @click="authStore.logout()"
        class="menu-logout"
      >
        <span class="material-symbols-outlined">logout</span>
        <span class="menu-item-text">Sair</span>
      </button>
    </div>
  </aside>

  <nav class="mobile-menu">
    <RouterLink
      to="/dashboard"
      class="mobile-nav-item"
      :class="{ 'mobile-nav-item-active': isRouteActive('/dashboard') }"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/dashboard'))"
      >
        dashboard
      </span>
      <span class="mobile-nav-text">Dashboard</span>
    </RouterLink>

    <RouterLink
      to="/clientes"
      class="mobile-nav-item"
      :class="{ 'mobile-nav-item-active': isRouteActive('/clientes') }"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/clientes'))"
      >
        groups
      </span>
      <span class="mobile-nav-text">Clientes</span>
    </RouterLink>

    <RouterLink
      to="/processos"
      class="mobile-nav-item"
      :class="{ 'mobile-nav-item-active': isRouteActive('/processos') }"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/processos'))"
      >
        account_tree
      </span>
      <span class="mobile-nav-text">Processos</span>
    </RouterLink>

    <button
      @click="authStore.logout()"
      class="mobile-nav-button"
    >
      <span class="material-symbols-outlined">logout</span>
      <span class="mobile-nav-text">Sair</span>
    </button>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Caslon+Text:wght@400;700&display=swap');

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

.desktop-menu {
  display: none;
  flex-direction: column;
  padding: 16px;
  gap: 8px;
  height: 100%;
  width: 280px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 40;
  background-color: #faf9f6;
  border-right: 1px solid rgba(197, 198, 208, 0.3);
  margin-top: 64px;
}

@media (min-width: 768px) {
  .desktop-menu {
    display: flex;
  }
}

.menu-nav {
  margin-top: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  color: #44464f;
}

.menu-item:hover {
  background-color: #efeeeb;
}

.menu-item-active {
  background-color: #112752;
  color: white;
}

.menu-item-active-bg {
  background-color: #efeeeb;
  font-weight: 700;
}

.menu-item-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.menu-footer {
  margin-top: auto;
  border-top: 1px solid rgba(197, 198, 208, 0.2);
  padding-top: 16px;
}

.menu-logout {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  width: 100%;
  color: #44464f;
  transition: all 0.2s;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.menu-logout:hover {
  background-color: rgba(186, 26, 26, 0.1);
}

.mobile-menu {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 50;
  background-color: rgba(250, 249, 246, 0.9);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(197, 198, 208, 0.3);
  height: 64px;
  padding: 0 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.2s;
  color: #44464f;
  opacity: 0.7;
}

.mobile-nav-item-active {
  color: #CFB53B;
  font-weight: 700;
  transform: scale(1.1);
  opacity: 1;
}

.mobile-nav-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.mobile-nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #44464f;
  opacity: 0.7;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
}
</style>