<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const email = ref((route.query.email as string) || '')
const password = ref('')
const confirmPassword = ref('')
const nome = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)

const definirSenha = async () => {
  error.value = ''

  if (!email.value || !password.value || !nome.value) {
    error.value = 'Preencha todos os campos.'
    return
  }

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
    await adminStore.completarCadastro({
      email: email.value,
      password: password.value,
      nome: nome.value,
    })
    success.value = true
    setTimeout(() => router.push('/login'), 3000)
  } catch (e: any) {
    error.value = 'Erro ao cadastrar. Verifique o link ou tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-dvh bg-[#faf9f6] flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl border border-[#1B2A4A]/10 p-8">
      <div v-if="success" class="text-center">
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-lg">
          <span class="material-symbols-outlined text-emerald-600 text-3xl">check_circle</span>
        </div>
        <h1 class="text-2xl font-serif font-bold text-[#1B2A4A] mb-2">Conta criada!</h1>
        <p class="text-[#44464f]">Redirecionando para o login...</p>
      </div>

      <div v-else>
        <div class="flex items-center gap-md mb-xl">
          <div class="w-12 h-12 bg-[#112752] rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-white">lock</span>
          </div>
          <div>
            <h1 class="text-2xl font-serif font-bold text-[#1B2A4A]">Bem-vindo!</h1>
            <p class="text-sm text-[#44464f]">Complete seu cadastro para acessar o sistema.</p>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-md rounded-lg mb-lg text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="definirSenha" class="space-y-lg">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input v-model="nome" type="text" required placeholder="Seu nome"
              class="w-full p-md border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="email" type="email" required disabled
              class="w-full p-md border border-gray-300 rounded-lg bg-gray-50 opacity-60" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input v-model="password" type="password" required placeholder="Mínimo 6 caracteres"
              class="w-full p-md border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input v-model="confirmPassword" type="password" required placeholder="Repita a senha"
              class="w-full p-md border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C]" />
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-[#112752] text-white py-md rounded-lg font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-50">
            <span v-if="loading">Criando conta...</span>
            <span v-else>Criar Conta</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>