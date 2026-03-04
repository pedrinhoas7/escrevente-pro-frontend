<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const protocolo = ref('');
const error = ref('');

const consultar = () => {
    if (!protocolo.value) {
        error.value = 'Por favor, insira o protocolo.';
        return;
    }
    router.push(`/consulta/${protocolo.value}`);
};
</script>

<template>
  <div class="min-h-dvh bg-[#F8F7F4] flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl border border-[#1B2A4A]/10 p-8 text-center">
        <h1 class="text-3xl font-serif font-bold text-[#1B2A4A] mb-4">Consulta de Processo</h1>
        <p class="text-[#6B7280] mb-8">Digite o número do protocolo para acompanhar o andamento do seu processo.</p>

        <form @submit.prevent="consultar" class="space-y-6">
            <div>
                <input 
                    v-model="protocolo" 
                    type="text" 
                    placeholder="Protocolo (ex: 2024-1234)" 
                    class="w-full text-center text-xl tracking-widest p-4 border rounded-lg focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                />
            </div>
            
            <div v-if="error" class="text-red-500 text-sm">
                {{ error }}
            </div>

            <button 
                type="submit" 
                class="w-full bg-[#1B2A4A] text-[#C9A84C] font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors shadow-lg transform hover:-translate-y-0.5"
            >
                CONSULTAR PROCESSO
            </button>
        </form>

        <div class="mt-8 text-sm text-[#6B7280]">
            <router-link to="/login" class="hover:text-[#1B2A4A] underline">Área do Escrevente</router-link>
        </div>
    </div>
  </div>
</template>
