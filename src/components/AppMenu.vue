<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const isRouteActive = (path: string) => route.path.startsWith(path)

const getIconStyle = (isActive: boolean) => {
  return isActive ? 'font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;' : ''
}

const relatoriosExpandido = ref(false)

watch(() => route.path, (path) => {
  if (path.startsWith('/app/relatorios')) {
    relatoriosExpandido.value = true
  }
}, { immediate: true })
</script>

<template>
  <aside class="desktop-menu">
    <nav class="menu-nav">
      <RouterLink
        to="/app/dashboard"
        class="menu-item"
        :class="{ 'menu-item-active-bg': isRouteActive('/app/dashboard') }"
      >
        <span class="material-symbols-outlined">dashboard</span>
        <span class="menu-item-text">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/app/processos"
        class="menu-item menu-item-inactive"
        :class="{ 'menu-item-active-bg': isRouteActive('/app/processos') }"
      >
        <span class="material-symbols-outlined">account_tree</span>
        <span class="menu-item-text">Processos</span>
      </RouterLink>

      <RouterLink
        to="/app/clientes"
        class="menu-item menu-item-inactive"
        :class="{ 'menu-item-active-bg': isRouteActive('/app/clientes') }"
      >
        <span class="material-symbols-outlined">groups</span>
        <span class="menu-item-text">Clientes</span>
      </RouterLink>

      <RouterLink
        v-if="authStore.isCartorio"
        to="/app/escreventes"
        class="menu-item menu-item-inactive"
        :class="{ 'menu-item-active-bg': isRouteActive('/app/escreventes') }"
      >
        <span class="material-symbols-outlined">badge</span>
        <span class="menu-item-text">Escreventes</span>
      </RouterLink>

      <div class="menu-item-group">
        <button
          class="menu-item menu-item-button"
          :class="{ 'menu-item-active-bg': isRouteActive('/app/relatorios') }"
          @click="relatoriosExpandido = !relatoriosExpandido"
        >
          <span class="material-symbols-outlined">summarize</span>
          <span class="menu-item-text">Relatórios</span>
          <span
            class="material-symbols-outlined submenu-arrow"
            :class="{ 'submenu-arrow-open': relatoriosExpandido }"
          >
            expand_more
          </span>
        </button>

        <Transition name="submenu">
          <div v-if="relatoriosExpandido" class="submenu">
            <RouterLink
              to="/app/relatorios/comissoes"
              class="submenu-item"
              :class="{ 'submenu-item-active': isRouteActive('/app/relatorios/comissoes') }"
            >
              <span class="material-symbols-outlined submenu-icon">payments</span>
              <span class="submenu-text">Comissões</span>
            </RouterLink>
            <RouterLink
              to="/app/relatorios/processos"
              class="submenu-item"
              :class="{ 'submenu-item-active': isRouteActive('/app/relatorios/processos') }"
            >
              <span class="material-symbols-outlined submenu-icon">description</span>
              <span class="submenu-text">Processos Mensal</span>
            </RouterLink>
          </div>
        </Transition>
      </div>
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
      to="/app/dashboard"
      class="mobile-nav-item"
      :class="{ 'mobile-nav-item-active': isRouteActive('/app/dashboard') }"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/app/dashboard'))"
      >
        dashboard
      </span>
      <span class="mobile-nav-text">Dashboard</span>
    </RouterLink>

    <RouterLink
      to="/app/clientes"
      class="mobile-nav-item"
      :class="{ 'mobile-nav-item-active': isRouteActive('/app/clientes') }"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/app/clientes'))"
      >
        groups
      </span>
      <span class="mobile-nav-text">Clientes</span>
    </RouterLink>

    <RouterLink
      to="/app/processos"
      class="mobile-nav-item"
      :class="{ 'mobile-nav-item-active': isRouteActive('/app/processos') }"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/app/processos'))"
      >
        account_tree
      </span>
      <span class="mobile-nav-text">Processos</span>
    </RouterLink>

    <RouterLink
      to="/app/relatorios/processos"
      class="mobile-nav-item"
      :class="{ 'mobile-nav-item-active': isRouteActive('/app/relatorios') }"
    >
      <span
        class="material-symbols-outlined"
        :style="getIconStyle(isRouteActive('/app/relatorios'))"
      >
        summarize
      </span>
      <span class="mobile-nav-text">Relatórios</span>
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
  height: calc(100vh - 64px);
  width: 280px;
  position: fixed;
  left: 0;
  top: 64px;
  z-index: 40;
  background-color: #faf9f6;
  border-right: 1px solid rgba(197, 198, 208, 0.3);
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

.menu-item-group {
  display: flex;
  flex-direction: column;
}

.menu-item-button {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.submenu-arrow {
  margin-left: auto;
  font-size: 20px;
  transition: transform 0.2s ease;
  color: #6B7280;
}

.submenu-arrow-open {
  transform: rotate(180deg);
}

.submenu {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  margin-top: 4px;
  gap: 2px;
  overflow: hidden;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #44464f;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.submenu-item::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(117, 119, 128, 0.3);
}

.submenu-item:hover {
  background-color: #efeeeb;
}

.submenu-item-active {
  background-color: rgba(17, 39, 82, 0.08);
  color: #112752;
  font-weight: 700;
}

.submenu-item-active::before {
  background: #112752;
  width: 4px;
  height: 16px;
  border-radius: 2px;
}

.submenu-icon {
  font-size: 20px;
  color: inherit;
}

.submenu-text {
  letter-spacing: 0.03em;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 200px;
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
  padding: 0 8px;
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
  font-size: 10px;
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