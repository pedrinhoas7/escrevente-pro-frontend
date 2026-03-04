<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProcessosStore } from '../stores/processos';
import TimelineStatus from '../components/TimelineStatus.vue';

const route = useRoute();
const processosStore = useProcessosStore();
const loading = ref(true);
const error = ref('');

onMounted(async () => {
    try {
        await processosStore.consultarProtocolo(route.params.protocolo as string);
    } catch (e: any) {
        error.value = 'Protocolo não encontrado ou erro de conexão.';
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <div class="min-h-screen bg-[#F8F7F4] p-8">
      <div class="max-w-4xl mx-auto" v-if="!loading && processosStore.processoAtual">
        <div class="bg-white rounded-lg shadow-xl border border-[#1B2A4A]/10 p-8 mb-8">
            <h1 class="text-3xl font-serif font-bold text-[#1B2A4A] mb-2">{{ processosStore.processoAtual.tipoAto }}</h1>
             <p class="text-[#6B7280]">Protocolo: <span class="font-mono text-[#1B2A4A] font-bold">{{ processosStore.processoAtual.protocolo }}</span></p>
             
             <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1B2A4A] text-sm bg-gray-50 p-4 rounded-lg">
-                <div><span class="font-bold">Tipo de Ato:</span> {{ processosStore.processoAtual.tipoAto }}</div>
+                <div><span class="font-bold">Tipo de Ato:</span> {{ processosStore.processoAtual.tipoAto }}</div>
                 <div><span class="font-bold">Data de Entrada:</span> {{ new Date((processosStore.processoAtual.dataEntrada as any)._seconds * 1000).toLocaleDateString() }}</div>
             </div>
        </div>

        <div class="bg-white rounded-lg shadow-xl border border-[#1B2A4A]/10 p-8">
            <h2 class="text-2xl font-serif font-bold text-[#1B2A4A] mb-6">Histórico do Processo</h2>
            <TimelineStatus :history="processosStore.processoAtual.statusHistory || []" :isPublic="true" />
        </div>

        <div class="mt-8 text-center">
            <router-link to="/consulta" class="text-[#C9A84C] hover:text-[#1B2A4A] font-medium transition-colors">
                Nova Consulta
            </router-link>
        </div>
      </div>

      <div v-else-if="loading" class="min-h-screen flex items-center justify-center text-[#1B2A4A]">
          Carregando informações...
      </div>

      <div v-else class="min-h-screen flex flex-col items-center justify-center text-[#1B2A4A]">
          <p class="text-xl mb-4">{{ error }}</p>
          <router-link to="/consulta" class="bg-[#1B2A4A] text-[#C9A84C] px-6 py-2 rounded-lg hover:bg-opacity-90">
              Voltar
          </router-link>
      </div>
  </div>
</template>
