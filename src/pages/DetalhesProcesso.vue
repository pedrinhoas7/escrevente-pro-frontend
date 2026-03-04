<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProcessosStore } from '../stores/processos';
import TimelineStatus from '../components/TimelineStatus.vue';
import PartesSection from '../components/PartesSection.vue';

const route = useRoute();
const processosStore = useProcessosStore();
const novoStatus = ref({
    status: 'Em análise',
    observacao: ''
});

const statusOpcoes = [
    "Em análise",
    "Falta de documento",
    "Indeferido",
    "Aguardando assinatura",
    "Documentação entregue ao cliente",
    "Concluído / Registrado"
];

onMounted(() => {
    processosStore.getProcesso(route.params.id as string);
});

const adicionarStatus = async () => {
    if (!novoStatus.value.status) return;
    
    try {
        await processosStore.addStatus(route.params.id as string, novoStatus.value);
        novoStatus.value.observacao = ''; // Limpa observação
        // Status mantém o selecionado ou reseta? Manter selecionado é útil.
    } catch (error) {
        alert("Erro ao adicionar status: " + error);
    }
};
</script>

<template>
  <div class="min-h-screen bg-[#F8F7F4] p-4 md:p-8">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8" v-if="processosStore.processoAtual">
        
        <!-- Coluna Esquerda: Detalhes e Partes -->
        <div class="lg:col-span-2 space-y-8">
            <div class="bg-white rounded-lg shadow-sm border border-[#1B2A4A]/10 p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h1 class="text-2xl font-serif font-bold text-[#1B2A4A]">{{ processosStore.processoAtual.tipoAto }}</h1>
                         <p class="text-[#6B7280]">Protocolo: <span class="font-mono text-[#1B2A4A] font-bold">{{ processosStore.processoAtual.protocolo }}</span></p>
                     </div>
                 </div>
                 <div class="text-sm text-[#1B2A4A] mt-4">
-                    <p><span class="font-bold">Tipo de Ato:</span> {{ processosStore.processoAtual.tipoAto }}</p>
+                    <p><span class="font-bold">Tipo de Ato:</span> {{ processosStore.processoAtual.tipoAto }}</p>
                     <p class="mt-2"><span class="font-bold">Notas Internas:</span></p>
                     <p class="bg-gray-50 p-3 rounded mt-1 border border-gray-100">{{ processosStore.processoAtual.notasInternas || 'Nenhuma nota interna.' }}</p>
                 </div>
            </div>

            <PartesSection :partes="processosStore.processoAtual.partes" />
        </div>

        <!-- Coluna Direita: Status e Ações -->
        <div class="space-y-8">
            <!-- Adicionar Novo Status -->
            <div class="bg-white rounded-lg shadow-sm border border-[#1B2A4A]/10 p-6">
                <h3 class="text-lg font-serif font-bold text-[#1B2A4A] mb-4">Atualizar Status</h3>
                <form @submit.prevent="adicionarStatus" class="space-y-4">
                    <div>
                        <label for="novo-status" class="block text-sm font-medium text-gray-700">Novo Status</label>
                        <select v-model="novoStatus.status" id="novo-status" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]">
                            <option v-for="opt in statusOpcoes" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                    </div>
                    <div>
                        <label for="observacao" class="block text-sm font-medium text-gray-700">Observação</label>
                        <textarea v-model="novoStatus.observacao" id="observacao" rows="3" class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#C9A84C] focus:border-[#C9A84C]" placeholder="Obrigatório para 'Falta de documento' e 'Indeferido'"></textarea>
                    </div>
                    <button type="submit" class="btn-primary w-full min-h-[44px]">
                        Registrar Status
                    </button>
                </form>
            </div>

            <!-- Timeline -->
            <TimelineStatus :history="processosStore.processoAtual.statusHistory || []" />
        </div>
    </div>
    <div v-else class="text-center py-20 text-[#1B2A4A]">
        Carregando detalhes do processo...
    </div>
  </div>
</template>
