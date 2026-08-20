<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { initializeApp } from 'firebase/app'
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'

const router = useRouter()
const route = useRoute()

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCqEOCTctOLCnHi3DxWUTZRPBnjKxw393k',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'escrevente-pro.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'escrevente-pro',
}

const app = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(app)

const oobCode = ref((route.query.oobCode as string) || '')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)
const verifying = ref(true)
const emailVerified = ref('')

onMounted(async () => {
  if (!oobCode.value) {
    error.value = 'Link inválido ou expirado.'
    verifying.value = false
    return
  }

  try {
    emailVerified.value = await verifyPasswordResetCode(firebaseAuth, oobCode.value)
  } catch (e: any) {
    error.value = 'Link inválido ou expirado. Solicite um novo email de redefinição.'
  } finally {
    verifying.value = false
  }
})

const redefinir = async () => {
  error.value = ''

  if (password.value.length < 6) {
    error.value = 'A senha deve ter no mínimo 6 caracteres.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem.'
    return
  }

  loading.value = true

  try {
    await confirmPasswordReset(firebaseAuth, oobCode.value, password.value)
    success.value = true
    setTimeout(() => router.push('/login'), 3000)
  } catch (e: any) {
    if (e.code === 'auth/expired-action-code') {
      error.value = 'Link expirado. Solicite um novo email de redefinição.'
    } else if (e.code === 'auth/invalid-action-code') {
      error.value = 'Link inválido. Solicite um novo email de redefinição.'
    } else if (e.code === 'auth/weak-password') {
      error.value = 'Senha muito fraca. Use no mínimo 6 caracteres.'
    } else {
      error.value = 'Erro ao redefinir senha. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-dvh bg-[#faf9f6] flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Brand -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-12 h-12 bg-[#112752] rounded-xl flex items-center justify-center mb-3 shadow-lg">
          <span class="text-white font-serif font-bold text-xl">E</span>
        </div>
        <h1 class="font-serif text-lg font-semibold text-[#112752]">Cartorial Tech</h1>
        <p class="text-xs text-[#44464f]">Sistema Notarial</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl border border-[#e2e8f0] shadow-xl overflow-hidden">
        <!-- Loading verify -->
        <div v-if="verifying" class="p-8 flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-2 border-[#112752]/20 border-t-[#112752] rounded-full animate-spin"></div>
          <p class="text-[#44464f]">Verificando link...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error && !loading && !success" class="p-8 flex flex-col items-center gap-4">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-red-500 text-3xl">error</span>
          </div>
          <h2 class="text-xl font-serif font-bold text-[#112752]">Link inválido</h2>
          <p class="text-sm text-[#44464f] text-center">{{ error }}</p>
          <router-link to="/login"
            class="mt-2 bg-[#112752] text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all">
            Voltar para login
          </router-link>
        </div>

        <!-- Success -->
        <div v-else-if="success" class="p-8 flex flex-col items-center gap-4">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-emerald-600 text-3xl">check_circle</span>
          </div>
          <h2 class="text-xl font-serif font-bold text-[#112752]">Senha redefinida!</h2>
          <p class="text-sm text-[#44464f] text-center">Sua senha foi alterada com sucesso.<br>Redirecionando para o login...</p>
        </div>

        <!-- Form -->
        <div v-else>
          <!-- Header -->
          <div class="bg-[#112752] p-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-white">lock_reset</span>
              </div>
              <div>
                <h2 class="text-lg font-serif font-bold text-white">Redefinir Senha</h2>
                <p class="text-sm text-white/70">{{ emailVerified }}</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {{ error }}
            </div>

            <form @submit.prevent="redefinir" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-[#44464f] mb-1">Nova senha</label>
                <input v-model="password" type="password" required placeholder="Mínimo 6 caracteres"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] text-base" />
              </div>

              <div>
                <label class="block text-sm font-medium text-[#44464f] mb-1">Confirmar senha</label>
                <input v-model="confirmPassword" type="password" required placeholder="Repita a senha"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] text-base" />
              </div>

              <button type="submit" :disabled="loading"
                class="w-full bg-[#112752] text-white py-3 rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all disabled:opacity-50">
                <span v-if="loading">Redefinindo...</span>
                <span v-else>Redefinir senha</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <p class="text-center text-xs text-[#767780] mt-6">
        © 2024 Cartorial Tech. Sistema Notarial Avançado.
      </p>
    </div>
  </div>
</template>