<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()
const expandedCartorio = ref<string | null>(null)

onMounted(() => {
  adminStore.fetchMetrics()
  adminStore.fetchUsuarios()
})

const cartorios = computed(() => adminStore.usuarios.filter(u => u.role === 'cartorio'))
const escreventesAvulsos = computed(() => adminStore.usuarios.filter(u => u.role === 'escrevente' && !u.cartorioId))
const admins = computed(() => adminStore.usuarios.filter(u => u.role === 'admin'))

const getEscreventesDoCartorio = (cartorioId: string) => {
  return adminStore.usuarios.filter(u => u.role === 'escrevente' && u.cartorioId === cartorioId)
}

const toggleCartorio = (uid: string) => {
  expandedCartorio.value = expandedCartorio.value === uid ? null : uid
}

const getInitials = (nome: string) => {
  return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}
</script>

<template>
  <div class="bg-background min-h-screen pb-24 px-3 mr-4 md:pb-8">
    <main>
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-lg mb-xl">
          <div>
            <h1 class="text-headline-lg font-serif font-bold text-primary mb-2">Painel Administrativo</h1>
            <p class="text-body-md text-on-surface-variant">Visão geral do sistema, cartórios e usuários.</p>
          </div>
          <router-link to="/app/admin/usuarios"
            class="w-full sm:w-auto bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md flex items-center justify-center gap-xs hover:shadow-lg transition-all active:scale-95 cursor-pointer">
            <span class="material-symbols-outlined">manage_accounts</span>
            Gerenciar Usuários
          </router-link>
        </div>

        <div v-if="!adminStore.metrics" class="flex flex-col items-center justify-center py-xl gap-md">
          <div class="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p class="text-on-surface-variant">Carregando métricas...</p>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
              <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total de Usuários</span>
              <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalUsuarios }}</span>
              <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
                <span class="material-symbols-outlined text-base">groups</span>
                <span>No sistema</span>
              </div>
            </div>

            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
              <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Cartórios</span>
              <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalCartorios }}</span>
              <div class="flex items-center gap-xs text-secondary text-label-sm">
                <span class="material-symbols-outlined text-base">business</span>
                <span>Cadastrados</span>
              </div>
            </div>

            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
              <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Escreventes</span>
              <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalEscreventes }}</span>
              <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
                <span class="material-symbols-outlined text-base">badge</span>
                <span>Vinculados + avulsos</span>
              </div>
            </div>

            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
              <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pendentes</span>
              <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalPendentes }}</span>
              <div class="flex items-center gap-xs text-orange-700 text-label-sm">
                <span class="material-symbols-outlined text-base">mail</span>
                <span>Aguardando cadastro</span>
              </div>
            </div>

            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
              <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total de Processos</span>
              <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalProcessos }}</span>
              <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
                <span class="material-symbols-outlined text-base">account_tree</span>
                <span>No sistema</span>
              </div>
            </div>

            <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
              <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total de Clientes</span>
              <span class="text-headline-md font-serif font-bold">{{ adminStore.metrics.totalClientes }}</span>
              <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
                <span class="material-symbols-outlined text-base">groups</span>
                <span>Cadastrados</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-xl">
            <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
              <div class="px-lg py-md border-b border-outline-variant/20 bg-surface-bright">
                <h3 class="text-body-lg font-serif font-bold">Cartórios e seus Escreventes</h3>
              </div>

              <div v-if="adminStore.loading" class="flex flex-col items-center justify-center py-xl gap-md">
                <div class="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p class="text-on-surface-variant text-label-sm">Carregando...</p>
              </div>

              <div v-else-if="cartorios.length === 0" class="p-xl text-center">
                <p class="text-on-surface-variant">Nenhum cartório cadastrado.</p>
              </div>

              <div v-else class="divide-y divide-outline-variant/20">
                <div v-for="cartorio in cartorios" :key="cartorio.uid">
                  <button
                    @click="toggleCartorio(cartorio.uid)"
                    class="w-full px-lg py-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <div class="flex items-center gap-md">
                      <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span class="material-symbols-outlined text-blue-700">business</span>
                      </div>
                      <div class="text-left">
                        <p class="text-label-md font-bold">{{ cartorio.nome }}</p>
                        <p class="text-label-sm text-on-surface-variant">{{ cartorio.email }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-sm">
                      <span class="px-sm py-xs rounded-full bg-surface-container-high text-label-sm font-label-sm text-on-surface-variant">
                        {{ getEscreventesDoCartorio(cartorio.uid).length }} escreventes
                      </span>
                      <span class="material-symbols-outlined text-on-surface-variant transition-transform" :class="{ 'rotate-90': expandedCartorio === cartorio.uid }">chevron_right</span>
                    </div>
                  </button>

                  <div v-if="expandedCartorio === cartorio.uid" class="bg-surface-container-low/50 px-lg py-md space-y-sm">
                    <div v-for="esc in getEscreventesDoCartorio(cartorio.uid)" :key="esc.uid" class="flex items-center gap-md py-xs">
                      <div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">
                        {{ getInitials(esc.nome) }}
                      </div>
                      <div class="flex-1">
                        <p class="text-label-sm font-medium">{{ esc.nome }}</p>
                        <p class="text-label-sm text-on-surface-variant">{{ esc.email }}</p>
                      </div>
                      <span class="px-sm py-xs rounded-full text-label-sm font-label-sm"
                        :class="esc.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-container-high text-on-surface-variant'">
                        {{ esc.ativo ? 'Ativo' : 'Inativo' }}
                      </span>
                    </div>
                    <div v-if="getEscreventesDoCartorio(cartorio.uid).length === 0" class="py-sm text-center">
                      <p class="text-label-sm text-on-surface-variant">Nenhum escrevente vinculado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-lg">
              <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
                <div class="px-lg py-md border-b border-outline-variant/20 bg-surface-bright">
                  <h3 class="text-body-lg font-serif font-bold">Escreventes Avulsos</h3>
                  <p class="text-label-sm text-on-surface-variant">Sem vínculo com cartório</p>
                </div>

                <div v-if="escreventesAvulsos.length === 0" class="p-xl text-center">
                  <p class="text-on-surface-variant text-label-sm">Nenhum escrevente avulso.</p>
                </div>

                <div v-else class="divide-y divide-outline-variant/20">
                  <div v-for="esc in escreventesAvulsos" :key="esc.uid" class="px-lg py-md flex items-center gap-md">
                    <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-label-sm">
                      {{ getInitials(esc.nome) }}
                    </div>
                    <div class="flex-1">
                      <p class="text-label-md font-medium">{{ esc.nome }}</p>
                      <p class="text-label-sm text-on-surface-variant">{{ esc.email }}</p>
                    </div>
                    <span class="px-sm py-xs rounded-full text-label-sm font-label-sm"
                      :class="esc.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-container-high text-on-surface-variant'">
                      {{ esc.ativo ? 'Ativo' : 'Inativo' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
                <div class="px-lg py-md border-b border-outline-variant/20 bg-surface-bright">
                  <h3 class="text-body-lg font-serif font-bold">Administradores</h3>
                </div>

                <div v-if="admins.length === 0" class="p-xl text-center">
                  <p class="text-on-surface-variant text-label-sm">Nenhum administrador.</p>
                </div>

                <div v-else class="divide-y divide-outline-variant/20">
                  <div v-for="adm in admins" :key="adm.uid" class="px-lg py-md flex items-center gap-md">
                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span class="material-symbols-outlined text-purple-700 text-base">admin_panel_settings</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-label-md font-medium">{{ adm.nome }}</p>
                      <p class="text-label-sm text-on-surface-variant">{{ adm.email }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>