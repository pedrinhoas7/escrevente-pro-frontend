<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProcessosStore } from '../stores/processos';
import { useClientesStore } from '../stores/clientes';
import type { TipoDeAto } from '../types/tipo-ato';
import { formatCurrency, parseCurrency } from '../utils/currency';

const route = useRoute();
const router = useRouter();
const processosStore = useProcessosStore();
const clientesStore = useClientesStore();

const processoId = route.params.id as string;

const form = ref({
    protocolo: '',
    tipoAto: '' as TipoDeAto,
    dataEntrada: '',
    partes: {
        outorganteVendedor: '',
        outorganteComprador: '',
        escrevente: '',
        apresentante: ''
    },
    valorProcesso: undefined as number | undefined,
    valorEmolumentos: undefined as number | undefined,
    notasInternas: ''
});

const valorProcessoInput = ref<string>('');
const valorEmolumentosInput = ref<string>('');

const tiposAto = computed<TipoDeAto[]>(() => processosStore.tiposAto);
const clientes = computed(() => clientesStore.clientes);

onMounted(async () => {
    await clientesStore.fetchClientes();
    await processosStore.fetchTiposAto();
    await processosStore.getProcesso(processoId);

    if (processosStore.processoAtual) {
        form.value = {
            protocolo: processosStore.processoAtual.protocolo || '',
            tipoAto: processosStore.processoAtual.tipoAto,
            dataEntrada: processosStore.processoAtual.dataEntrada.slice(0, 10), // AAAA-MM-DD
            partes: {
                outorganteVendedor: processosStore.processoAtual.partes?.outorganteVendedor || '',
                outorganteComprador: processosStore.processoAtual.partes?.outorganteComprador || '',
                escrevente: processosStore.processoAtual.partes?.escrevente || '',
                apresentante: processosStore.processoAtual.partes?.apresentante || ''
            },
            valorProcesso: processosStore.processoAtual.valorProcesso,
            valorEmolumentos: processosStore.processoAtual.valorEmolumentos,
            notasInternas: processosStore.processoAtual.notasInternas || ''
        };
        valorProcessoInput.value = formatCurrency(form.value.valorProcesso); // Inicializar input formatado
        valorEmolumentosInput.value = formatCurrency(form.value.valorEmolumentos); // Inicializar input formatado
    }
});

const onBlurValorProcesso = () => {
  form.value.valorProcesso = parseCurrency(valorProcessoInput.value);
  valorProcessoInput.value = formatCurrency(form.value.valorProcesso);
};

const onBlurValorEmolumentos = () => {
  form.value.valorEmolumentos = parseCurrency(valorEmolumentosInput.value);
  valorEmolumentosInput.value = formatCurrency(form.value.valorEmolumentos);
};

const salvarEdicao = async () => {
    try {
        if (!form.value.tipoAto) {
            throw new Error('Tipo de Ato é obrigatório');
        }
        await processosStore.updateProcesso(processoId, { ...form.value, tipoAto: form.value.tipoAto });
        router.push(`/processos/${processoId}`);
    } catch (error) {
        console.error("Erro ao salvar processo", error);
        alert("Erro ao salvar processo: " + (error as Error).message);
    }
};
</script>

<template>
  <div class="min-h-dvh bg-[#F8F7F4]">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-xl border border-[#1B2A4A]/10 p-6 md:p-8">
        <h1 class="text-2xl font-serif font-bold text-[#1B2A4A] mb-6 border-b pb-4">Editar Processo</h1>

        <form @submit.prevent="salvarEdicao" class="space-y-6">
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
                <div>
                    <label for="valorProcesso" class="block text-sm font-medium text-gray-700">Valor do Processo</label>
                    <input v-model="valorProcessoInput" @blur="onBlurValorProcesso" id="valorProcesso" type="text" inputmode="numeric" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
                </div>
                <div>
                    <label for="valorEmolumentos" class="block text-sm font-medium text-gray-700">Valor dos Emolumentos</label>
                    <input v-model="valorEmolumentosInput" @blur="onBlurValorEmolumentos" id="valorEmolumentos" type="text" inputmode="numeric" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
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
                        <label for="apresentante" class="block text-sm font-medium text-gray-700">Apresentante</label>
                        <select v-model="form.partes.apresentante" id="apresentante" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]">
                            <option value="" disabled>Selecione</option>
                            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
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
                <router-link :to="`/processos/${processoId}`" class="btn-secondary py-3 w-full sm:w-auto text-center">
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
