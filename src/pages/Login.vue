<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
    loading.value = true;
    error.value = '';
    
    try {
        await authStore.login(email.value, password.value);
        router.push('/dashboard');
    } catch (e: any) {
        error.value = 'Falha no login. Verifique suas credenciais.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
  <div class="bg-blue-900 text-white font-display antialiased h-screen w-full overflow-hidden flex flex-col items-center justify-between">
    <!-- Top Status Bar Area (Visual placeholder for iOS safe area) -->
    <div class="w-full h-12 flex-shrink-0"></div>
    <!-- Main Content Container -->
    <div class="flex-1 w-full max-w-md flex flex-col px-8 relative z-10">
      <!-- Header / Logo Area -->
      <div class="flex flex-col items-center justify-center pt-8 pb-12 flex-1">
        <div class="relative flex items-center justify-center w-24 h-24 mb-6 rounded-full border-2 border-secondary/30 bg-primary shadow-[0_0_30px_rgba(201,168,76,0.15)]">
          <span class="font-serif text-4xl text-[#C9A84C] font-bold tracking-widest pt-1">EP</span>
        </div>
        <h1 class="text-3xl font-serif text-white font-bold tracking-wide mb-2 text-center">Escrevente Pro</h1>
        <p class="text-slate-300 text-sm font-medium tracking-wide opacity-80 uppercase text-center">Gestão Notarial Premium</p>
      </div>
      <!-- Form Area -->
      <div class="w-full pb-8">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
          <!-- Email Input -->
          <label class="flex flex-col w-full">
            <p class="text-[#C9A84C]/90 text-sm font-medium leading-normal pb-2 ml-1">Email Corporativo</p>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#C9A84C] transition-colors">
                <span class="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <input v-model="email" class="form-input flex w-full rounded-xl text-white focus:outline-0 focus:ring-1 focus:ring-secondary border border-white/20 bg-white/5 focus:border-secondary h-14 placeholder:text-slate-500 pl-11 pr-4 text-base font-normal leading-normal transition-all duration-200" placeholder="exemplo@cartorio.com.br" type="email" required />
            </div>
          </label>
          <!-- Password Input -->
          <label class="flex flex-col w-full">
            <p class="text-[#C9A84C]/90 text-sm font-medium leading-normal pb-2 ml-1">Senha de Acesso</p>
            <div class="relative group flex w-full items-stretch rounded-xl">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#C9A84C] transition-colors z-10">
                <span class="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <input v-model="password" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-1 focus:ring-secondary border border-white/20 bg-white/5 focus:border-secondary h-14 placeholder:text-slate-500 pl-11 pr-12 text-base font-normal leading-normal transition-all duration-200 border-r-0 rounded-r-none" placeholder="••••••••" type="password" required />
              <button type="button" class="text-slate-400 hover:text-[#C9A84C] cursor-pointer flex border border-white/20 bg-white/5 items-center justify-center px-4 rounded-r-xl border-l-0 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-colors duration-200 group-focus-within:border-secondary">
                <span class="material-symbols-outlined text-[20px]">visibility_off</span>
              </button>
            </div>
          </label>

          <div v-if="error" class="text-red-500 text-sm text-center">
              {{ error }}
          </div>

          <!-- Action Button -->
          <button :disabled="loading" type="submit" class="mt-4 w-full h-14 bg-secondary hover:bg-[#b09342] text-primary font-bold text-lg rounded-xl shadow-lg shadow-black/20 transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2">
            <span v-if="loading">Entrando...</span>
            <span v-else>Entrar</span>
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
