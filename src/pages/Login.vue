<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } catch (e: any) {
    error.value = 'Credenciais inválidas. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-transparent pointer-events-none"></div>
    
    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center p-gutter relative z-10">
      <div class="w-full max-w-[440px]">
        
        <!-- Logo Section -->
        <div class="flex flex-col items-center mb-xl">
          <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-md shadow-lg shadow-primary/10">
            <span class="material-symbols-outlined text-white text-[28px]" style="font-variation-settings: 'FILL' 1;">
              gavel
            </span>
          </div>
          <h1 class="font-serif text-headline-md text-primary tracking-tight">Cartorial Tech</h1>
          <p class="text-on-surface-variant text-label-md mt-base opacity-70">Sistema Notarial Avançado</p>
        </div>

        <!-- Login Card -->
        <div class="glass-card rounded-2xl p-xl shadow-xl shadow-slate-200/50">
          <div class="mb-xl text-center md:text-left">
            <h2 class="font-serif text-headline-md text-on-surface">Bem-vindo de volta</h2>
            <p class="text-on-surface-variant text-body-md mt-xs">Acesse sua conta para gerenciar processos.</p>
          </div>

          <!-- Error Message -->
          <div 
            v-if="error" 
            class="flex items-center gap-sm p-md bg-error-container text-on-error-container rounded-lg mb-lg border border-error/10 animate-pulse"
          >
            <span class="material-symbols-outlined text-[20px]">error</span>
            <span class="text-label-md">{{ error }}</span>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-lg">
            <!-- Email Field -->
            <div class="space-y-base">
              <label class="font-label-md text-label-md text-on-surface-variant block ml-1" for="email">
                E-mail corporativo
              </label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors text-[20px]">
                  mail
                </span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="nome@cartorial.tech"
                  class="w-full pl-xl pr-md py-md bg-surface border border-outline-variant rounded-xl outline-none transition-all placeholder:text-outline-variant text-on-surface font-body-md focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-base">
              <div class="flex justify-between items-center ml-1">
                <label class="font-label-md text-label-md text-on-surface-variant" for="password">
                  Senha
                </label>
                <a href="#" class="text-label-sm text-secondary hover:underline transition-all">
                  Esqueceu a senha?
                </a>
              </div>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  class="w-full pl-xl pr-xl py-md bg-surface border border-outline-variant rounded-xl outline-none transition-all placeholder:text-outline-variant text-on-surface font-body-md focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant transition-colors p-base"
                >
                  <span class="material-symbols-outlined text-[20px]">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center gap-sm ml-1">
              <input
                id="remember"
                type="checkbox"
                class="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20"
              />
              <label for="remember" class="text-label-sm text-on-surface-variant cursor-pointer">
                Lembrar neste dispositivo
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-md px-lg shimmer-btn text-white font-label-md rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-sm disabled:opacity-90 disabled:cursor-not-allowed"
              :class="{ 'shimmer-active': loading }"
            >
              <span v-if="loading">Autenticando...</span>
              <span v-else>Entrar no Sistema</span>
              <div v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </button>
          </form>

          <!-- Public Access Link -->
          <div class="mt-xl pt-xl border-t border-outline-variant/30 text-center">
            <p class="text-on-surface-variant text-label-md">
              Acesso público?
              <router-link to="/consulta" class="text-secondary font-bold hover:text-on-secondary-fixed-variant transition-colors ml-xs flex items-center justify-center gap-xs inline-flex group">
                Consultar Processo
                <span class="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </router-link>
            </p>
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="mt-xl flex justify-center items-center gap-xl opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div class="flex items-center gap-xs">
            <span class="material-symbols-outlined text-[20px]">verified_user</span>
            <span class="text-label-sm font-label-sm">Criptografia SSL</span>
          </div>
          <div class="flex items-center gap-xs">
            <span class="material-symbols-outlined text-[20px]">security</span>
            <span class="text-label-sm font-label-sm">Certificação Digital</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-xl px-gutter bg-surface-container-lowest border-t border-outline-variant/20">
      <div class="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
        <span class="text-label-sm text-on-surface-variant opacity-60">
          © 2024 Cartorial Tech. Advanced Notary Advisory Systems.
        </span>
        <div class="flex gap-lg">
          <a href="#" class="text-label-sm text-on-surface-variant hover:text-secondary transition-colors">Ajuda</a>
          <a href="#" class="text-label-sm text-on-surface-variant hover:text-secondary transition-colors">Termos</a>
          <a href="#" class="text-label-sm text-on-surface-variant hover:text-secondary transition-colors">Privacidade</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.shimmer-btn {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
  background-size: 200% 100%;
}

.shimmer-active {
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}
</style>