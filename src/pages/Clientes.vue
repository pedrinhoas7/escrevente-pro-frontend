<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useClientesStore } from '../stores/clientes';

const clientesStore = useClientesStore();
const showModal = ref(false);
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

const salvarCliente = async () => {
    try {
        await clientesStore.addCliente(novoCliente.value);
        showModal.value = false;
        novoCliente.value = { nome: '', cpf: '', email: '', telefone: '', endereco: '' };
    } catch (error) {
        alert("Erro ao salvar cliente. Verifique o console ou a conexão.");
        console.error(error);
    }
};
</script>

<template>
  <div class="min-h-screen bg-[#F8F7F4] p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between md:items-center mb-8">
            <h1 class="text-3xl font-serif font-bold text-[#1B2A4A] mb-4 md:mb-0">Clientes</h1>
            <button @click="showModal = true" class="btn-primary min-h-[44px] w-full md:w-auto">
                Novo Cliente
            </button>
        </div>

        <!-- Table for Desktop -->
        <div class="hidden md:block bg-white shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                        <th scope="col" class="relative px-6 py-3">
                          <span class="sr-only">Ações</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="cliente in clientesStore.clientes" :key="cliente.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ cliente.nome }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.cpf }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.email }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cliente.telefone }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" class="text-[#1B2A4A] hover:text-[#C9A84C]">Editar</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Cards for Mobile -->
        <div class="md:hidden space-y-4">
          <div v-for="cliente in clientesStore.clientes" :key="cliente.id" class="bg-white shadow rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-bold text-[#1B2A4A]">{{ cliente.nome }}</p>
                <p class="text-sm text-gray-500">{{ cliente.cpf }}</p>
              </div>
              <a href="#" class="text-sm font-medium text-[#1B2A4A] hover:text-[#C9A84C]">Editar</a>
            </div>
            <div class="mt-4 space-y-2">
              <p class="text-sm text-gray-600"><strong class="font-medium text-gray-800">Email:</strong> {{ cliente.email }}</p>
              <p class="text-sm text-gray-600"><strong class="font-medium text-gray-800">Telefone:</strong> {{ cliente.telefone }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class=" transition-opacity" aria-hidden="true" @click="showModal = false"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 class="text-lg leading-6 font-serif font-medium text-[#1B2A4A]" id="modal-title">Novo Cliente</h3>
                    <div class="mt-4 space-y-4">
                        <input v-model="novoCliente.nome" type="text" placeholder="Nome Completo" class="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                        <input v-model="novoCliente.cpf" type="text" placeholder="CPF" class="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                        <input v-model="novoCliente.email" type="email" placeholder="Email" class="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                        <input v-model="novoCliente.telefone" type="text" placeholder="Telefone" class="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                        <input v-model="novoCliente.endereco" type="text" placeholder="Endereço" class="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button @click="salvarCliente" type="button" class="btn-primary w-full sm:w-auto py-3">
                        Salvar
                    </button>
                    <button @click="showModal = false" type="button" class="btn-secondary w-full mt-3 sm:mt-0 sm:w-auto py-3">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
      </div>
  </div>
</template>
