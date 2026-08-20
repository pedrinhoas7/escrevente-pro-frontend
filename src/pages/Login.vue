<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);
const showRecuperarSenha = ref(false);
const recuperarEmail = ref('');
const recuperarEnviado = ref(false);
const recuperarLoading = ref(false);

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
    if (authStore.userRole === 'admin') {
      router.push('/app/admin');
    } else {
      router.push('/app/dashboard');
    }
  } catch (e: any) {
    error.value = 'Credenciais inválidas. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

const handleRecuperarSenha = async () => {
  if (!recuperarEmail.value) {
    return;
  }
  recuperarLoading.value = true;
  try {
    await api.post('/admin/recuperar-senha', { email: recuperarEmail.value });
    recuperarEnviado.value = true;
  } catch (e: any) {
    error.value = 'Erro ao enviar email de recuperação.';
  } finally {
    recuperarLoading.value = false;
  }
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    if (authStore.userRole === 'admin') {
      router.push('/app/admin');
    } else {
      router.push('/app/dashboard');
    }
  }
});
</script>

<template>
  <div class="login-container">
    <!-- Background Gradient -->
    <div class="login-bg-gradient"></div>
    
    <!-- Main Content -->
    <main class="login-main">
      <div class="login-content">
        
        <!-- Logo Section -->
        <div class="login-logo-section">
          <div class="login-logo-icon">
            <span class="material-symbols-outlined login-logo-symbol">gavel</span>
          </div>
          <h1 class="login-title">Cartorial Tech</h1>
          <p class="login-subtitle">Sistema Notarial Avançado</p>
        </div>

        <!-- Login Card -->
        <div class="login-card">
          <div class="login-card-header">
            <h2 class="login-card-title">Bem-vindo de volta</h2>
            <p class="login-card-subtitle">Acesse sua conta para gerenciar processos.</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="login-error">
            <span class="material-symbols-outlined login-error-icon">error</span>
            <span>{{ error }}</span>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <!-- Email Field -->
            <div class="login-field-group">
              <label class="login-label" for="email">E-mail corporativo</label>
              <div class="login-input-wrapper">
                <span class="material-symbols-outlined login-input-icon">mail</span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="nome@cartorial.tech"
                  class="login-input"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="login-field-group">
              <div class="login-label-row">
                <label class="login-label" for="password">Senha</label>
                <button type="button" @click="showRecuperarSenha = true" class="login-forgot-link">Esqueceu a senha?</button>
              </div>
              <div class="login-input-wrapper">
                <span class="material-symbols-outlined login-input-icon">lock</span>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  class="login-input login-input-password"
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="login-password-toggle"
                >
                  <span class="material-symbols-outlined">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="login-remember">
              <input
                id="remember"
                type="checkbox"
                class="login-checkbox"
              />
              <label for="remember" class="login-remember-label">
                Lembrar neste dispositivo
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="login-submit-btn"
              :class="{ 'login-submit-btn-loading': loading }"
            >
              <span v-if="loading">Autenticando...</span>
              <span v-else>Entrar no Sistema</span>
              <div v-if="loading" class="login-spinner"></div>
            </button>
          </form>

          <!-- Public Access Link -->
          <div class="login-public-link">
            <p class="login-public-text">
              Acesso público?
              <router-link to="/consulta" class="login-public-action">
                Consultar Processo
                <span class="material-symbols-outlined login-public-icon">arrow_forward</span>
              </router-link>
            </p>
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="login-trust-badges">
          <div class="login-trust-item">
            <span class="material-symbols-outlined">verified_user</span>
            <span>Criptografia SSL</span>
          </div>
          <div class="login-trust-item">
            <span class="material-symbols-outlined">security</span>
            <span>Certificação Digital</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="login-footer">
      <div class="login-footer-content">
        <span class="login-footer-copyright">
          © 2024 Cartorial Tech. Advanced Notary Advisory Systems.
        </span>
        <div class="login-footer-links">
          <a href="#" class="login-footer-link">Ajuda</a>
          <a href="#" class="login-footer-link">Termos</a>
          <a href="#" class="login-footer-link">Privacidade</a>
        </div>
      </div>
    </footer>
    <!-- Modal Recuperar Senha -->
    <div v-if="showRecuperarSenha" class="fixed z-50 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen p-2.5">
        <div class="fixed inset-0 bg-black/50 transition-opacity" @click="showRecuperarSenha = false"></div>

        <div class="relative z-50 bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all w-full mx-2.5">
          <div class="bg-white p-8">
            <div v-if="recuperarEnviado" class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-outlined text-emerald-600 text-3xl">mark_email_read</span>
              </div>
              <h2 class="text-xl font-serif font-bold text-[#1B2A4A] mb-2">Email enviado!</h2>
              <p class="text-[#44464f] mb-6">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
              <button @click="showRecuperarSenha = false; recuperarEnviado = false"
                class="w-full bg-[#112752] text-white py-3 rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all">
                Fechar
              </button>
            </div>

            <div v-else>
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-[#112752] rounded-lg flex items-center justify-center">
                  <span class="material-symbols-outlined text-white">lock_reset</span>
                </div>
                <div>
                  <h2 class="text-xl font-serif font-bold text-[#1B2A4A]">Recuperar Senha</h2>
                  <p class="text-sm text-[#44464f]">Digite seu email para receber o link de redefinição.</p>
                </div>
              </div>

              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {{ error }}
              </div>

              <form @submit.prevent="handleRecuperarSenha" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input v-model="recuperarEmail" type="email" required placeholder="seu@email.com"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] text-base" />
                </div>

                <button type="submit" :disabled="recuperarLoading"
                  class="w-full bg-[#112752] text-white py-3 rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all disabled:opacity-50">
                  <span v-if="recuperarLoading">Enviando...</span>
                  <span v-else>Enviar Email</span>
                </button>

                <button type="button" @click="showRecuperarSenha = false"
                  class="w-full text-[#44464f] py-2 text-sm cursor-pointer hover:text-[#1B2A4A] transition-colors">
                  Voltar para login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #faf9f6;
  display: flex;
  flex-direction: column;
}

.login-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.login-main {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  z-index: 10;
}

.login-content {
  width: 100%;
  max-width: 440px;
}

/* Logo Section */
.login-logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.login-logo-icon {
  width: 48px;
  height: 48px;
  background-color: #112752;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 10px 15px rgba(17, 39, 82, 0.1);
}

.login-logo-symbol {
  color: white;
  font-size: 28px;
}

.login-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  color: #112752;
  margin: 0;
  letter-spacing: -0.01em;
}

.login-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #44464f;
  margin: 4px 0 0 0;
  opacity: 0.7;
}

/* Login Card */
.login-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 25px rgba(226, 232, 240, 0.5);
}

.login-card-header {
  margin-bottom: 32px;
  text-align: center;
}

.login-card-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  color: #1a1c1a;
  margin: 0 0 4px 0;
}

.login-card-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #44464f;
  margin: 0;
}

/* Error Message */
.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: #ffdad6;
  color: #93000a;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(186, 26, 26, 0.1);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.login-error-icon {
  font-size: 20px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 4px;
  margin-right: 4px;
}

.login-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #44464f;
  margin-left: 4px;
}

.login-forgot-link {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #CFB53B;
  text-decoration: none;
}

.login-forgot-link:hover {
  text-decoration: underline;
}

.login-input-wrapper {
  position: relative;
}

.login-input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #767780;
  font-size: 20px;
  pointer-events: none;
}

.login-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background-color: #ffffff;
  border: 1px solid #c5c6d0;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1a1c1a;
  outline: none;
  transition: all 0.2s;
}

.login-input::placeholder {
  color: #c5c6d0;
}

.login-input:focus {
  border-color: #CFB53B;
  box-shadow: 0 0 0 2px rgba(207, 181, 59, 0.2);
}

.login-input-password {
  padding-right: 48px;
}

.login-password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 16px;
  color: #c5c6d0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-password-toggle:hover {
  color: #44464f;
}

/* Remember Me */
.login-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
}

.login-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #c5c6d0;
  accent-color: #CFB53B;
}

.login-remember-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #44464f;
  cursor: pointer;
}

/* Submit Button */
.login-submit-btn {
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
  background-size: 200% 100%;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 10px 15px rgba(207, 181, 59, 0.2);
}

.login-submit-btn:hover {
  transform: scale(1.02);
}

.login-submit-btn:active {
  transform: scale(0.98);
}

.login-submit-btn-loading {
  opacity: 0.9;
  cursor: not-allowed;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.login-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Public Link */
.login-public-link {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(197, 198, 208, 0.3);
  text-align: center;
}

.login-public-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #44464f;
  margin: 0;
}

.login-public-action {
  color: #CFB53B;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.login-public-action:hover {
  color: #112752;
}

.login-public-icon {
  font-size: 16px;
  transition: transform 0.2s;
}

.login-public-action:hover .login-public-icon {
  transform: translateX(4px);
}

/* Trust Badges */
.login-trust-badges {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  opacity: 0.4;
  filter: grayscale(100%);
  transition: all 0.5s;
}

.login-trust-badges:hover {
  opacity: 1;
  filter: grayscale(0%);
}

.login-trust-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #44464f;
}

/* Footer */
.login-footer {
  width: 100%;
  padding: 32px 24px;
  background-color: #ffffff;
  border-top: 1px solid rgba(197, 198, 208, 0.2);
}

.login-footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .login-footer-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.login-footer-copyright {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #44464f;
  opacity: 0.6;
}

.login-footer-links {
  display: flex;
  gap: 32px;
}

.login-footer-link {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #44464f;
  text-decoration: none;
  transition: color 0.2s;
}

.login-footer-link:hover {
  color: #CFB53B;
}

/* Material Symbols */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

/* Responsive */
@media (max-width: 767px) {
  .login-main {
    padding: 16px;
  }
  
  .login-card {
    padding: 24px;
  }
  
  .login-card-title {
    font-size: 20px;
  }
  
  .login-trust-badges {
    flex-direction: column;
    gap: 16px;
  }
}
</style>