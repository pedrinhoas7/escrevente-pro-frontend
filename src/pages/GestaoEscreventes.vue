<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEscreventesStore } from '../stores/escreventes'

const escreventesStore = useEscreventesStore()
const searchTerm = ref('')
const showModal = ref(false)
const editingUid = ref<string | null>(null)

const novoEscrevente = ref({
  email: '',
  password: '',
  nome: ''
})

onMounted(() => {
  escreventesStore.fetchEscreventes()
})

const filteredEscreventes = computed(() => {
  if (!searchTerm.value) return escreventesStore.escreventes
  const term = searchTerm.value.toLowerCase()
  return escreventesStore.escreventes.filter(e =>
    e.nome.toLowerCase().includes(term) || e.email.toLowerCase().includes(term)
  )
})

const totalEscreventes = computed(() => escreventesStore.escreventes.length)
const escreventesAtivos = computed(() => escreventesStore.escreventes.filter(e => e.ativo).length)

const getInitials = (nome: string) => {
  return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const salvarEscrevente = async () => {
  try {
    if (editingUid.value) {
      await escreventesStore.updateEscrevente(editingUid.value, { nome: novoEscrevente.value.nome })
    } else {
      await escreventesStore.addEscrevente({
        email: novoEscrevente.value.email,
        password: novoEscrevente.value.password,
        nome: novoEscrevente.value.nome
      })
    }
    showModal.value = false
    novoEscrevente.value = { email: '', password: '', nome: '' }
    editingUid.value = null
  } catch (error) {
    alert('Erro ao salvar escrevente. Verifique os dados.')
    console.error(error)
  }
}

const editarEscrevente = (e: typeof escreventesStore.escreventes[number]) => {
  editingUid.value = e.uid
  novoEscrevente.value = { email: e.email, password: '', nome: e.nome }
  showModal.value = true
}

const toggleAtivo = async (e: typeof escreventesStore.escreventes[number]) => {
  try {
    await escreventesStore.updateEscrevente(e.uid, { ativo: !e.ativo })
  } catch (error) {
    alert('Erro ao alterar status.')
    console.error(error)
  }
}

const excluirEscrevente = async (id: string) => {
  if (confirm('Tem certeza que deseja remover este escrevente? Ele perderá acesso ao sistema.')) {
    try {
      await escreventesStore.deleteEscrevente(id)
    } catch (error) {
      alert('Erro ao excluir escrevente.')
      console.error(error)
    }
  }
}
</script>

<template>
  <div class="bg-background min-h-screen pb-24 px-3 mr-4 md:pb-8">
    <main>
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-lg mb-xl">
          <div>
            <h1 class="text-headline-lg font-serif font-bold text-primary mb-2">Gestão de Escreventes</h1>
            <p class="text-body-md text-on-surface-variant">Gerencie os escreventes vinculados ao seu cartório.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-md items-center w-full lg:w-auto">
            <div class="relative w-full sm:w-80">
              <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline mt-3 -ml-2">search</span>
              <input v-model="searchTerm"
                class="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-label-md font-sans"
                placeholder="Buscar pelo nome ou email..." type="text" />
            </div>
            <button @click="showModal = true; editingUid = null; novoEscrevente = { email: '', password: '', nome: '' }"
              class="w-full sm:w-auto bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md flex items-center justify-center gap-xs hover:shadow-lg transition-all active:scale-95">
              <span class="material-symbols-outlined">add</span>
              Novo Escrevente
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total de Escreventes</span>
            <span class="text-headline-md font-serif font-bold">{{ totalEscreventes }}</span>
            <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
              <span class="material-symbols-outlined text-base">badge</span>
              <span>Vinculados ao cartório</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Escreventes Ativos</span>
            <span class="text-headline-md font-serif font-bold">{{ escreventesAtivos }}</span>
            <div class="flex items-center gap-xs text-emerald-600 text-label-sm">
              <span class="material-symbols-outlined text-base">check_circle</span>
              <span>Com acesso ao sistema</span>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <div class="px-lg py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-bright">
            <h3 class="text-body-lg font-serif font-bold">Listagem de Escreventes</h3>
          </div>

          <div v-if="escreventesStore.loading" class="p-xl text-center">
            <div class="animate-pulse flex flex-col items-center gap-md">
              <div class="w-10 h-10 bg-surface-container rounded-full"></div>
              <div class="h-4 bg-surface-container rounded w-1/2"></div>
              <p class="text-on-surface-variant">Carregando escreventes...</p>
            </div>
          </div>

          <div v-else-if="filteredEscreventes.length === 0" class="p-xl text-center">
            <div class="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span class="material-symbols-outlined text-on-surface-variant">badge</span>
            </div>
            <p class="text-primary font-semibold">Nenhum escrevente encontrado</p>
            <p class="text-on-surface-variant text-body-sm mt-1">Cadastre o primeiro escrevente clicando em "Novo Escrevente"</p>
          </div>

          <div v-else class="hidden md:block overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="text-left bg-surface-container-low">
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">NOME</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">EMAIL</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">STATUS</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/20">
                <tr v-for="e in filteredEscreventes" :key="e.uid" class="hover:bg-surface-container-lowest transition-colors">
                  <td class="px-lg py-md">
                    <div class="flex items-center gap-md">
                      <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-label-sm">
                        {{ getInitials(e.nome) }}
                      </div>
                      <p class="text-label-md font-bold">{{ e.nome }}</p>
                    </div>
                  </td>
                  <td class="px-lg py-md text-label-md text-on-surface-variant">{{ e.email }}</td>
                  <td class="px-lg py-md">
                    <button @click="toggleAtivo(e)"
                      class="px-md py-xs rounded-full text-label-sm font-label-sm flex items-center w-fit gap-xs transition-colors"
                      :class="e.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-container-high text-on-surface-variant'">
                      <span class="material-symbols-outlined text-sm">{{ e.ativo ? 'check_circle' : 'cancel' }}</span>
                      {{ e.ativo ? 'Ativo' : 'Inativo' }}
                    </button>
                  </td>
                  <td class="px-lg py-md text-right">
                    <div class="flex items-center justify-end gap-sm">
                      <button @click="editarEscrevente(e)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer" title="Editar">
                        <span class="material-symbols-outlined text-base text-on-surface-variant">edit</span>
                      </button>
                      <button @click="excluirEscrevente(e.uid)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer" title="Excluir">
                        <span class="material-symbols-outlined text-base text-on-surface-variant">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredEscreventes.length > 0" class="md:hidden flex flex-col divide-y divide-outline-variant/20">
            <div v-for="e in filteredEscreventes" :key="e.uid" class="p-lg flex flex-col gap-md">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-label-sm">
                  {{ getInitials(e.nome) }}
                </div>
                <div>
                  <p class="text-label-md font-bold">{{ e.nome }}</p>
                  <p class="text-label-sm text-on-surface-variant">{{ e.email }}</p>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <button @click="toggleAtivo(e)"
                  class="px-sm py-xs rounded-full text-label-sm font-label-sm"
                  :class="e.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-container-high text-on-surface-variant'">
                  {{ e.ativo ? 'Ativo' : 'Inativo' }}
                </button>
                <div class="flex gap-sm">
                  <button @click="editarEscrevente(e)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base text-on-surface-variant">edit</span>
                  </button>
                  <button @click="excluirEscrevente(e.uid)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base text-on-surface-variant">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <div v-if="showModal" class="fixed z-50 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen p-2.5">
        <div class="fixed inset-0 bg-black/50 transition-opacity" @click="showModal = false"></div>

        <div class="relative z-50 bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all w-full mx-2.5">
          <div class="bg-white px-2xl py-2xl">
            <h3 class="text-headline-md font-serif font-bold text-primary mb-xl">{{ editingUid ? 'Editar Escrevente' : 'Novo Escrevente' }}</h3>
            <div class="space-y-lg">
              <div>
                <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Nome Completo</label>
                <input v-model="novoEscrevente.nome" type="text" placeholder="Nome do escrevente"
                  class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
              </div>
              <div>
                <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Email</label>
                <input v-model="novoEscrevente.email" type="email" placeholder="email@exemplo.com" :disabled="!!editingUid"
                  class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md disabled:opacity-50 disabled:bg-surface-container-low" />
              </div>
              <div v-if="!editingUid">
                <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Senha</label>
                <input v-model="novoEscrevente.password" type="password" placeholder="Senha de acesso"
                  class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
              </div>
            </div>
          </div>
          <div class="bg-surface-container-low px-2xl py-md flex flex-row-reverse gap-md">
            <button @click="salvarEscrevente" type="button"
              class="w-full sm:w-auto bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:shadow-lg transition-all cursor-pointer">
              Salvar
            </button>
            <button @click="showModal = false; editingUid = null" type="button"
              class="w-full sm:w-auto border border-outline-variant text-primary px-lg py-sm rounded-lg font-label-md hover:bg-surface-container transition-all cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>