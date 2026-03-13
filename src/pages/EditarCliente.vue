<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClientesStore } from '../stores/clientes';

const route = useRoute();
const router = useRouter();
const clientesStore = useClientesStore();

const clienteId = route.params.id as string;

const form = ref({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
});

onMounted(async () => {
    await clientesStore.fetchCliente(clienteId);
    if (clientesStore.clienteAtual) {
        form.value = {
            nome: clientesStore.clienteAtual.nome || '',
            cpf: clientesStore.clienteAtual.cpf || '',
            telefone: clientesStore.clienteAtual.telefone || '',
            email: clientesStore.clienteAtual.email || '',
            endereco: clientesStore.clienteAtual.endereco || '',
        };
    }
});

const salvarEdicao = async () => {
    try {
        await clientesStore.updateCliente(clienteId, form.value);
        router.push('/clientes');
    } catch (error) {
        console.error("Erro ao salvar cliente", error);
        alert("Erro ao salvar cliente: " + (error as Error).message);
    }
};
</script>

<template>
  <div class="min-h-dvh bg-[#F8F7F4]">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-xl border border-[#1B2A4A]/10 p-6 md:p-8">
        <h1 class="text-2xl font-serif font-bold text-[#1B2A4A] mb-6 border-b pb-4">Editar Cliente</h1>

        <form @submit.prevent="salvarEdicao" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                <div>
                    <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
                    <input v-model="form.nome" id="nome" type="text" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="cpf" class="block text-sm font-medium text-gray-700">CPF (opcional)</label>
                    <input v-model="form.cpf" v-maska data-maska="['###.###.###-##', '##.###.###/####-##']" id="cpf" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone</label>
                    <input v-model="form.telefone" v-maska data-maska="['(##) ####-####', '(##) #####-####']" id="telefone" type="text" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email (opcional)</label>
                    <input v-model="form.email" id="email" type="email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="endereco" class="block text-sm font-medium text-gray-700">Endereço</label>
                    <input v-model="form.endereco" id="endereco" type="text" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A4C]" />
                </div>
            </div>

            <div class="border-t border-gray-200 pt-2 md:pt-6 flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 sm:space-y-2 sm:space-x-3">
                <router-link to="/clientes" class="btn-secondary py-3 w-full sm:w-auto text-center">
                    Cancelar
                </router-link>
                <button type="submit" class="btn-primary py-3 w-full sm:w-auto mb-2">
                    Salvar Edição
                </button>
            </div>
        </form>
    </div>
  </div>
</template>
