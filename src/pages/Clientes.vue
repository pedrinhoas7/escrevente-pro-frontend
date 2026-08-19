<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useClientesStore } from '../stores/clientes';

const clientesStore = useClientesStore();
const showModal = ref(false);
const searchTerm = ref('');
const novoCliente = ref({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  endereco: ''
});

onMounted(() => {
  clientesStore.fetchClientes();
});

const filteredClientes = computed(() => {
  if (!searchTerm.value) {
    return clientesStore.clientes;
  }
  const term = searchTerm.value.toLowerCase();
  return clientesStore.clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(term)
  );
});

const totalClientes = computed(() => clientesStore.clientes.length);

const clientesNovosMes = computed(() => {
  const now = new Date();
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
  return clientesStore.clientes.filter(c => {
    const criado = c.criadoEm?._seconds ? new Date(c.criadoEm._seconds * 1000) : new Date(c.criadoEm);
    return criado >= inicioMes;
  }).length;
});

const getInitials = (nome: string) => {
  return nome
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const salvarCliente = async () => {
  try {
    await clientesStore.addCliente(novoCliente.value);
    showModal.value = false;
    novoCliente.value = { nome: '', cpf: '', email: '', telefone: '', endereco: '' };
  } catch (error) {
    alert('Erro ao salvar cliente. Verifique o console ou a conexão.');
    console.error(error);
  }
};

const excluirCliente = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    try {
      await clientesStore.deleteCliente(id);
    } catch (error) {
      alert('Erro ao excluir cliente.');
      console.error(error);
    }
  }
};

const formatCPF = (cpf: string) => {
  if (!cpf) return '---';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `***.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}*-**`;
  } else if (cleaned.length === 14) {
    return `**.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/****-**`;
  }
  return cpf;
};
</script>

<template>
  <div class="bg-background min-h-screen pb-24 px-3 mr-4 md:pb-8">
    <main class="">
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-lg mb-xl">
          <div>
            <h1 class="text-headline-lg font-serif font-bold text-primary mb-2">Gestão de Clientes</h1>
            <p class="text-body-md text-on-surface-variant">Visualize e gerencie seus clientes cadastrados.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-md items-center w-full lg:w-auto">
            <div class="relative w-full sm:w-80">
              <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline mt-3 -ml-2">search</span>
              <input
                v-model="searchTerm"
                class="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-label-md font-sans"
                placeholder="Buscar pelo nome do cliente..."
                type="text"
              />
            </div>
            <button
              @click="showModal = true"
              class="w-full sm:w-auto bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md flex items-center justify-center gap-xs hover:shadow-lg transition-all active:scale-95"
            >
              <span class="material-symbols-outlined">add</span>
              Novo Cliente
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total de Clientes</span>
            <span class="text-headline-md font-serif font-bold">{{ totalClientes }}</span>
            <div class="flex items-center gap-xs text-on-tertiary-container text-label-sm">
              <span class="material-symbols-outlined text-base">groups</span>
              <span>Cadastrados no sistema</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 flex flex-col gap-xs">
            <span class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Novos Este Mês</span>
            <span class="text-headline-md font-serif font-bold">{{ clientesNovosMes }}</span>
            <div class="flex items-center gap-xs text-secondary text-label-sm">
              <span class="material-symbols-outlined text-base">trending_up</span>
              <span>Recém-cadastrados</span>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <div class="px-lg py-md border-b border-outline-variant/20 flex justify-between items-center bg-surface-bright">
            <h3 class="text-body-lg font-serif font-bold">Listagem de Clientes</h3>
          </div>

          <div v-if="clientesStore.loading" class="p-xl text-center">
            <div class="animate-pulse flex flex-col items-center gap-md">
              <div class="w-10 h-10 bg-surface-container rounded-full"></div>
              <div class="h-4 bg-surface-container rounded w-1/2"></div>
              <p class="text-on-surface-variant">Carregando clientes...</p>
            </div>
          </div>

          <div v-else-if="filteredClientes.length === 0" class="p-xl text-center">
            <div class="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span class="material-symbols-outlined text-on-surface-variant">groups</span>
            </div>
            <p class="text-primary font-semibold">Nenhum cliente encontrado</p>
            <p class="text-on-surface-variant text-body-sm mt-1">Cadastre o primeiro cliente clicando em "Novo Cliente"</p>
          </div>

          <div v-else class="hidden md:block overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="text-left bg-surface-container-low">
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">NOME DO CLIENTE</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">CPF REDIGIDO</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant">CONTATO</th>
                  <th class="px-lg py-md text-label-sm font-label-sm text-on-surface-variant text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/20">
                <tr
                  v-for="cliente in filteredClientes"
                  :key="cliente.id"
                  class="hover:bg-surface-container-lowest transition-colors group"
                >
                  <td class="px-lg py-md">
                    <div class="flex items-center gap-md">
                      <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-label-sm">
                        {{ getInitials(cliente.nome) }}
                      </div>
                      <div>
                        <p class="text-label-md font-bold">{{ cliente.nome }}</p>
                        <p class="text-label-sm text-on-surface-variant">{{ cliente.email || '---' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-lg py-md text-label-md font-mono text-on-surface-variant">
                    {{ formatCPF(cliente.cpf || '') }}
                  </td>
                  <td class="px-lg py-md text-label-md text-on-surface-variant">
                    {{ cliente.telefone || '---' }}
                  </td>
                  <td class="px-lg py-md text-right">
                    <div class="flex items-center justify-end gap-sm">
                      <router-link
                        :to="`/app/clientes/${cliente.id}/editar`"
                        class="p-sm hover:bg-surface-container rounded-md transition-colors"
                        title="Editar"
                      >
                        <span class="material-symbols-outlined text-base text-secondary">edit</span>
                      </router-link>
                      <button
                        @click="excluirCliente(cliente.id!)"
                        class="p-sm hover:bg-error-container/30 rounded-md transition-colors"
                        title="Excluir"
                      >
                        <span class="material-symbols-outlined text-base text-error">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredClientes.length > 0" class="md:hidden flex flex-col divide-y divide-outline-variant/20">
            <div
              v-for="cliente in filteredClientes"
              :key="cliente.id"
              class="p-lg flex flex-col gap-md"
            >
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-md">
                  <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-label-sm">
                    {{ getInitials(cliente.nome) }}
                  </div>
                  <div>
                    <p class="text-label-md font-bold">{{ cliente.nome }}</p>
                    <p class="text-label-sm text-on-surface-variant">{{ formatCPF(cliente.cpf || '') }}</p>
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center text-label-sm">
                <span class="text-on-surface-variant">{{ cliente.telefone || '---' }}</span>
                <div class="flex gap-sm">
                  <router-link
                    :to="`/app/clientes/${cliente.id}/editar`"
                    class="p-sm hover:bg-surface-container rounded-md transition-colors"
                  >
                    <span class="material-symbols-outlined text-base text-secondary">edit</span>
                  </router-link>
                  <button
                    @click="excluirCliente(cliente.id!)"
                    class="p-sm hover:bg-error-container/30 rounded-md transition-colors"
                  >
                    <span class="material-symbols-outlined text-base text-error">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredClientes.length > 0" class="px-lg py-md bg-surface-bright flex flex-col sm:flex-row justify-between items-center gap-md">
            <p class="text-label-sm text-on-surface-variant">Mostrando {{ filteredClientes.length }} de {{ totalClientes }} clientes</p>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="showModal"
      class="fixed z-50 inset-0 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen p-2.5">
        <div class="fixed inset-0 bg-black/50 transition-opacity" @click="showModal = false"></div>

        <div class="relative z-50 bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all w-full mx-2.5">
          <div class="bg-white px-2xl py-2xl">
            <h3 class="text-headline-md font-serif font-bold text-primary mb-xl">Novo Cliente</h3>
            <div class="space-y-lg">
              <input
                v-model="novoCliente.nome"
                type="text"
                placeholder="Nome Completo"
                class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md"
              />
              <input
                v-model="novoCliente.cpf"
                v-maska
                data-maska="['###.###.###-##', '##.###.###/####-##']"
                type="text"
                placeholder="CPF/CNPJ (opcional)"
                class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md"
              />
              <input
                v-model="novoCliente.email"
                type="email"
                placeholder="Email (opcional)"
                class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md"
              />
              <input
                v-model="novoCliente.telefone"
                v-maska
                data-maska="['(##) ####-####', '(##) #####-####']"
                type="text"
                placeholder="Telefone"
                class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md"
              />
              <input
                v-model="novoCliente.endereco"
                type="text"
                placeholder="Endereço"
                class="w-full p-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary text-body-md"
              />
            </div>
          </div>
          <div class="bg-surface-container-low px-lg py-md sm:flex sm:flex-row-reverse gap-md">
            <button
              @click="salvarCliente"
              type="button"
              class="w-full sm:w-auto bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md hover:shadow-lg transition-all"
            >
              Salvar
            </button>
            <button
              @click="showModal = false"
              type="button"
              class="w-full mt-md sm:mt-0 sm:w-auto border border-outline-variant text-primary px-lg py-sm rounded-lg font-label-md hover:bg-surface-container transition-all"
            >
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