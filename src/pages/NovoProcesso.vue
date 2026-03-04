<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProcessosStore } from '../stores/processos';
import { useClientesStore } from '../stores/clientes';
import type { TipoDeAto } from '../types/tipo-ato';

const router = useRouter();
const processosStore = useProcessosStore();
const clientesStore = useClientesStore();

const form = ref({
    protocolo: '',
    tipoAto: '' as TipoDeAto,
    dataEntrada: new Date().toISOString().slice(0, 10),
    partes: {
        outorganteVendedor: '',
        outorganteComprador: '',
        escrevente: '',
        apresentante: ''
    },
    notasInternas: ''
});

const tiposAto = computed<TipoDeAto[]>(() => processosStore.tiposAto);

onMounted(async () => {
  await clientesStore.fetchClientes();
  await processosStore.fetchTiposAto();
});


const salvar = async () => {
    try {
        if (!form.value.tipoAto) {
            throw new Error('Tipo de Ato é obrigatório');
        }
        await processosStore.addProcesso({ ...form.value, tipoAto: form.value.tipoAto });
        router.push('/processos');
    } catch (error) {
        console.error("Erro ao salvar processo", error);
    }
};
</script>

<template>
  <div class="min-h-dvh bg-[#F8F7F4]  ">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-xl border border-[#1B2A4A]/10 p-6 md:p-8">
        <h1 class="text-2xl font-serif font-bold text-[#1B2A4A] mb-6 border-b pb-4">Novo Processo</h1>

        <form @submit.prevent="salvar" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                <div>
                    <label for="protocolo" class="block text-sm font-medium text-gray-700">Protocolo (opcional)</label>
                    <input v-model="form.protocolo" id="protocolo" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="tipoAto" class="block text-sm font-medium text-gray-700">Tipo de Ato</label>
                    <select v-model="form.tipoAto" id="tipoAto" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]">
                        <option :value="null" disabled>Selecione um tipo</option>
                        <option v-for="tipo in tiposAto" :key="tipo" :value="tipo">{{ tipo }}</option>
                    </select>
                </div>
                <div>
                    <label for="dataEntrada" class="block text-sm font-medium text-gray-700">Data de Entrada</label>
                    <input v-model="form.dataEntrada" id="dataEntrada" type="date" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
            </div>

            <div class="border-t border-gray-200 pt-2 md:pt-6">
                <h3 class="text-lg font-serif font-medium text-[#1B2A4A] mb-4">Partes Envolvidas</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
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


            <div>
                <label for="notasInternas" class="block text-sm font-medium text-gray-700">Notas Internas</label>
                <textarea v-model="form.notasInternas" id="notasInternas" rows="4" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]"></textarea>
            </div>

            <div class="border-t border-gray-200 pt-2 md:pt-6 flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 sm:space-y-2 sm:space-x-3">
                <router-link to="/processos" class="btn-secondary py-3 w-full sm:w-auto text-center">
                    Cancelar
                </router-link>
                <button type="submit" class="btn-primary py-3 w-full sm:w-auto mb-2">
                    Salvar Processo
                </button>
            </div>
        </form>
    </div>
  </div>
</template>
