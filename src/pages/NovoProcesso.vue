<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProcessosStore } from '../stores/processos';
import { useClientesStore } from '../stores/clientes';

const router = useRouter();
const processosStore = useProcessosStore();
const clientesStore = useClientesStore();

const form = ref({
    protocolo: '',
    titulo: '',
    tipoAto: '',
    dataEntrada: new Date().toISOString().slice(0, 10),
    partes: {
        outorganteVendedor: '',
        outorganteComprador: '',
        escrevente: '',
        apresentante: ''
    },
    clienteId: '',
    notasInternas: ''
});

onMounted(() => {
  clientesStore.fetchClientes();
});


const salvar = async () => {
    try {
        await processosStore.addProcesso(form.value);
        router.push('/processos');
    } catch (error) {
        console.error("Erro ao salvar processo", error);
    }
};
</script>

<template>
  <div class="min-h-screen bg-[#F8F7F4] p-4 md:p-8">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-xl border border-[#1B2A4A]/10 p-6 md:p-8">
        <h1 class="text-2xl font-serif font-bold text-[#1B2A4A] mb-6 border-b pb-4">Novo Processo</h1>

        <form @submit.prevent="salvar" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="protocolo" class="block text-sm font-medium text-gray-700">Protocolo</label>
                    <input v-model="form.protocolo" id="protocolo" type="text" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="titulo" class="block text-sm font-medium text-gray-700">Título do Processo</label>
                    <input v-model="form.titulo" id="titulo" type="text" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="tipoAto" class="block text-sm font-medium text-gray-700">Tipo de Ato</label>
                    <input v-model="form.tipoAto" id="tipoAto" type="text" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="dataEntrada" class="block text-sm font-medium text-gray-700">Data de Entrada</label>
                    <input v-model="form.dataEntrada" id="dataEntrada" type="date" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-serif font-medium text-[#1B2A4A] mb-4">Partes Envolvidas</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label for="outorganteVendedor" class="block text-sm font-medium text-gray-700">Outorgante Vendedor</label>
                        <input v-model="form.partes.outorganteVendedor" id="outorganteVendedor" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                    </div>
                     <div>
                        <label for="outorganteComprador" class="block text-sm font-medium text-gray-700">Outorgante Comprador</label>
                        <input v-model="form.partes.outorganteComprador" id="outorganteComprador" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                    </div>
                     <div>
                        <label for="escrevente" class="block text-sm font-medium text-gray-700">Escrevente Responsável</label>
                        <input v-model="form.partes.escrevente" id="escrevente" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                    </div>
                     <div>
                        <label for="apresentante" class="block text-sm font-medium text-gray-700">Apresentante</label>
                        <select v-model="form.partes.apresentante" id="apresentante" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]">
                            <option value="" disabled>Selecione</option>
                            <option v-for="cliente in clientesStore.clientes" :key="cliente.id" :value="cliente.id">
                                {{ cliente.nome }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
                <label for="clienteId" class="block text-sm font-medium text-gray-700">Cliente Principal</label>
                 <select v-model="form.clienteId" id="clienteId" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]">
                    <option value="" disabled>Selecione um cliente</option>
                    <option v-for="cliente in clientesStore.clientes" :key="cliente.id" :value="cliente.id">
                        {{ cliente.nome }}
                    </option>
                </select>
            </div>

            <div>
                <label for="notasInternas" class="block text-sm font-medium text-gray-700">Notas Internas</label>
                <textarea v-model="form.notasInternas" id="notasInternas" rows="4" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]"></textarea>
            </div>

            <div class="border-t border-gray-200 pt-6 flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <router-link to="/processos" class="btn-secondary py-3 w-full sm:w-auto text-center">
                    Cancelar
                </router-link>
                <button type="submit" class="btn-primary py-3 w-full sm:w-auto">
                    Salvar Processo
                </button>
            </div>
        </form>
    </div>
  </div>
</template>
