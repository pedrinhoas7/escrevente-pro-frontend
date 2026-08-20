<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()
const searchTerm = ref('')
const showModal = ref(false)
const editingUid = ref<string | null>(null)

const novoUsuario = ref({
  email: '',
  nome: '',
  role: 'escrevente',
  cartorioId: ''
})

onMounted(() => {
  adminStore.fetchUsuarios()
  adminStore.fetchCartorios()
})

const filteredUsuarios = computed(() => {
  if (!searchTerm.value) return adminStore.usuarios
  const term = searchTerm.value.toLowerCase()
  return adminStore.usuarios.filter(u =>
    u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
  )
})

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  cartorio: 'Cartório',
  escrevente: 'Escrevente',
  usuario: 'Usuário',
}

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  cartorio: 'bg-blue-100 text-blue-700',
  escrevente: 'bg-emerald-100 text-emerald-700',
  usuario: 'bg-surface-container-high text-on-surface-variant',
}

const getInitials = (nome: string) => {
  return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const getCartorioNome = (cartorioId: string | null | undefined) => {
  if (!cartorioId) return '---'
  const cartorio = adminStore.cartorios.find(c => c.uid === cartorioId)
  return cartorio ? cartorio.nome : '---'
}

const salvarUsuario = async () => {
  try {
    if (editingUid.value) {
      await adminStore.atualizarUsuario(editingUid.value, {
        nome: novoUsuario.value.nome,
        role: novoUsuario.value.role,
        cartorioId: novoUsuario.value.cartorioId || null,
      })
    } else {
      await adminStore.criarUsuario({
        email: novoUsuario.value.email,
        nome: novoUsuario.value.nome,
        role: novoUsuario.value.role,
        cartorioId: novoUsuario.value.role === 'escrevente' ? novoUsuario.value.cartorioId : undefined,
      })
    }
    showModal.value = false
    novoUsuario.value = { email: '', nome: '', role: 'escrevente', cartorioId: '' }
    editingUid.value = null
  } catch (error) {
    alert('Erro ao salvar usuário.')
    console.error(error)
  }
}

const editarUsuario = (u: typeof adminStore.usuarios[number]) => {
  editingUid.value = u.uid
  novoUsuario.value = {
    email: u.email,
    nome: u.nome,
    role: u.role,
    cartorioId: u.cartorioId || ''
  }
  showModal.value = true
}

const excluirUsuario = async (uid: string) => {
  if (confirm('Tem certeza que deseja excluir este usuário? Ele perderá acesso ao sistema.')) {
    try {
      await adminStore.deletarUsuario(uid)
    } catch (error) {
      alert('Erro ao excluir usuário.')
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
            <h1 class="text-headline-lg font-serif font-bold text-primary mb-2">Gestão de Usuários</h1>
            <p class="text-body-md text-on-surface-variant">Cadastre e gerencie todos os usuários do sistema.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-md items-center w-full lg:w-auto">
            <div class="relative w-full sm:w-80">
              <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline mt-3 -ml-2">search</span>
              <input v-model="searchTerm"
                class="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-label-md font-sans"
                placeholder="Buscar pelo nome ou email..." type="text" />
            </div>
            <button @click="showModal = true; editingUid = null; novoUsuario = { email: '', nome: '', role: 'escrevente', cartorioId: '' }"
              class="w-full sm:w-auto bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md flex items-center justify-center gap-xs hover:shadow-lg transition-all active:scale-95 cursor-pointer">
              <span class="material-symbols-outlined">person_add</span>
              Novo Usuário
            </button>
          </div>
        </div>

        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <div class="px-lg py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-bright">
            <h3 class="text-body-lg font-serif font-bold">Listagem de Usuários</h3>
          </div>

          <div v-if="adminStore.loading" class="flex flex-col items-center justify-center py-xl gap-md">
            <div class="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p class="text-on-surface-variant">Carregando usuários...</p>
          </div>

          <div v-else-if="filteredUsuarios.length === 0" class="p-xl text-center">
            <div class="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span class="material-symbols-outlined text-on-surface-variant">groups</span>
            </div>
            <p class="text-primary font-semibold">Nenhum usuário encontrado</p>
          </div>

          <div v-else class="hidden md:block overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="text-left bg-surface-container-low">
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">NOME</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">EMAIL</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">TIPO</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">CARTÓRIO</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/20">
                <tr v-for="u in filteredUsuarios" :key="u.uid" class="hover:bg-surface-container-lowest transition-colors">
                  <td class="px-lg py-md">
                    <div class="flex items-center gap-md">
                      <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-label-sm">
                        {{ getInitials(u.nome || u.email) }}
                      </div>
                      <p class="text-label-md font-bold">{{ u.nome || u.email }}</p>
                    </div>
                  </td>
                  <td class="px-lg py-md text-label-md text-on-surface-variant">{{ u.email }}</td>
                  <td class="px-lg py-md">
                    <span class="px-md py-xs rounded-full text-label-sm font-label-sm" :class="roleColors[u.role] || roleColors.usuario">
                      {{ roleLabels[u.role] || u.role }}
                    </span>
                  </td>
                  <td class="px-lg py-md text-label-md text-on-surface-variant">{{ getCartorioNome(u.cartorioId) }}</td>
                  <td class="px-lg py-md text-right">
                    <div class="flex items-center justify-end gap-sm">
                      <button @click="editarUsuario(u)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer" title="Editar">
                        <span class="material-symbols-outlined text-base text-on-surface-variant">edit</span>
                      </button>
                      <button @click="excluirUsuario(u.uid)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer" title="Excluir">
                        <span class="material-symbols-outlined text-base text-on-surface-variant">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredUsuarios.length > 0" class="md:hidden flex flex-col divide-y divide-outline-variant/20">
            <div v-for="u in filteredUsuarios" :key="u.uid" class="p-lg flex flex-col gap-md">
              <div class="flex items-center gap-md">
                <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-label-sm">
                  {{ getInitials(u.nome || u.email) }}
                </div>
                <div>
                  <p class="text-label-md font-bold">{{ u.nome || u.email }}</p>
                  <p class="text-label-sm text-on-surface-variant">{{ u.email }}</p>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="px-sm py-xs rounded-full text-label-sm font-label-sm" :class="roleColors[u.role] || roleColors.usuario">
                  {{ roleLabels[u.role] || u.role }}
                </span>
                <div class="flex gap-sm">
                  <button @click="editarUsuario(u)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-base text-on-surface-variant">edit</span>
                  </button>
                  <button @click="excluirUsuario(u.uid)" class="p-sm hover:bg-surface-container rounded-md transition-colors cursor-pointer">
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
            <h3 class="text-headline-md font-serif font-bold text-primary mb-xl">{{ editingUid ? 'Editar Usuário' : 'Novo Usuário' }}</h3>
            <div class="space-y-lg">
              <div>
                <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Nome Completo</label>
                <input v-model="novoUsuario.nome" type="text" placeholder="Nome do usuário"
                  class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md" />
              </div>
              <div>
                <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Email</label>
                <input v-model="novoUsuario.email" type="email" placeholder="email@exemplo.com" :disabled="!!editingUid"
                  class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md disabled:opacity-50 disabled:bg-surface-container-low" />
              </div>
              <div>
                <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Tipo de Usuário</label>
                <select v-model="novoUsuario.role" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md bg-white">
                  <option value="escrevente">Escrevente</option>
                  <option value="cartorio">Cartório</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div v-if="novoUsuario.role === 'escrevente'">
                <label class="block text-label-sm font-medium text-on-surface-variant mb-xs">Cartório Vinculado</label>
                <select v-model="novoUsuario.cartorioId" class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md bg-white">
                  <option value="">Selecione um cartório</option>
                  <option v-for="c in adminStore.cartorios" :key="c.uid" :value="c.uid">{{ c.nome }}</option>
                </select>
              </div>
              <div v-if="!editingUid" class="bg-surface-container-low p-md rounded-lg">
                <p class="text-label-sm text-on-surface-variant">
                  <span class="material-symbols-outlined text-base align-middle mr-xs">mail</span>
                  Um email de convite será enviado para {{ novoUsuario.email || 'o usuário' }} com instruções para cadastrar a senha.
                </p>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-low px-2xl py-md flex flex-row-reverse gap-md">
            <button @click="salvarUsuario" type="button"
              class="w-full sm:w-auto bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:shadow-lg transition-all cursor-pointer">
              {{ editingUid ? 'Salvar' : 'Enviar Convite' }}
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