<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const protocoloBusca = ref('')

const consultarProtocolo = () => {
  if (protocoloBusca.value.trim()) {
    router.push(`/consulta/${protocoloBusca.value.trim()}`)
  }
}

const WHATSAPP_URL = 'https://wa.me/5583998461353?text=Ol%C3%A1!%20Tenho%20interesse%20no%20sistema%20Cartorial%20Tech%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.'

const abrirWhatsApp = () => {
  window.open(WHATSAPP_URL, '_blank')
}

const features = [
  {
    icon: 'account_tree',
    title: 'Gestão de Processos',
    desc: 'Acompanhe todos os atos notariais do início ao registro, com status em tempo real e timeline completa.',
  },
  {
    icon: 'groups',
    title: 'Cadastro de Clientes',
    desc: 'Mantenha um banco de dados organizado de apresentantes e outorgantes com histórico de processos.',
  },
  {
    icon: 'summarize',
    title: 'Relatórios Detalhados',
    desc: 'Gere relatórios de processos mensais com filtros por período e exportação para impressão.',
  },
  {
    icon: 'payments',
    title: 'Controle Financeiro',
    desc: 'Acompanhe valores e emolumentos de cada processo com relatórios por período.',
  },
  {
    icon: 'search',
    title: 'Consulta Pública',
    desc: 'Permita que clientes acompanhem o andamento do processo pelo número de protocolo, sem login.',
  },
  {
    icon: 'shield',
    title: 'Segurança e Conformidade',
    desc: 'Autenticação JWT, criptografia SSL e controle de acesso por perfil de usuário.',
  },
]

const passos = [
  { num: '01', title: 'Cadastro do Processo', desc: 'Registre o ato notarial com partes, valores e tipo de documento.' },
  { num: '02', title: 'Acompanhamento', desc: 'Atualize o status em cada etapa até a conclusão e registro.' },
  { num: '03', title: 'Relatórios', desc: 'Gere relatórios de produtividade mensal com um clique.' },
]

const planos = [
  {
    nome: 'Essencial',
    destaque: false,
    desc: 'Para escreventes autônomos',
    recursos: [
      'Gestão de processos ilimitada',
      'Cadastro de clientes',
      'Consulta pública por protocolo',
      'Relatório mensal de processos',
      'Suporte por e-mail',
    ],
  },
  {
    nome: 'Profissional',
    destaque: true,
    desc: 'Para equipes de cartório',
    recursos: [
      'Tudo do plano Essencial',
      'Relatórios financeiros detalhados',
      'Gráficos de evolução no dashboard',
      'Controle de valores por processo',
      'Múltiplos usuários com perfis',
      'Suporte prioritário por WhatsApp',
    ],
  },
  {
    nome: 'Empresarial',
    destaque: false,
    desc: 'Para redes e franquias',
    recursos: [
      'Tudo do plano Profissional',
      'Múltiplas unidades',
      'Relatórios consolidados',
      'API de integração',
      'Gerente de conta dedicado',
      'Onboarding personalizado',
    ],
  },
]
</script>

<template>
  <div class="landing">
    <header class="landing-header">
      <div class="header-content">
        <div class="header-brand">
          <div class="brand-icon">
            <span class="material-symbols-outlined">gavel</span>
          </div>
          <span class="brand-name">Cartorial Tech</span>
        </div>
        <nav class="header-nav">
          <a href="#features" class="nav-link">Recursos</a>
          <a href="#planos" class="nav-link">Planos</a>
          <a href="#como-funciona" class="nav-link">Como Funciona</a>
          <router-link to="/consulta" class="nav-link">Consultar</router-link>
          <router-link to="/login" class="nav-login">
            <span class="material-symbols-outlined">login</span>
            Acessar Plataforma
          </router-link>
          <button @click="abrirWhatsApp" class="nav-cta">
            <span class="material-symbols-outlined">chat</span>
            Falar com Vendas
          </button>
        </nav>
      </div>
    </header>

    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-badge">Sistema Notarial Avançado</span>
          <h1 class="hero-title">
            Gestão completa de<br />
            <span class="hero-title-accent">atos notariais</span>
          </h1>
          <p class="hero-subtitle">
            Plataforma integrada para escreventes e apresentantes gerenciarem processos
            e clientes com eficiência e segurança.
          </p>
          <div class="hero-actions">
            <button @click="abrirWhatsApp" class="btn-primary">
              <span class="material-symbols-outlined">chat</span>
              Falar com Vendas
            </button>
            <router-link to="/consulta" class="btn-secondary">
              <span class="material-symbols-outlined">search</span>
              Consultar Processo
            </router-link>
          </div>
        </div>

        <div class="hero-card">
          <div class="card-header">
            <span class="material-symbols-outlined card-icon">search</span>
            <h3 class="card-title">Consulta de Protocolo</h3>
          </div>
          <p class="card-desc">Acompanhe o andamento do seu processo</p>
          <form @submit.prevent="consultarProtocolo" class="card-form">
            <input
              v-model="protocoloBusca"
              type="text"
              placeholder="Ex: 2024-1234"
              class="card-input"
            />
            <button type="submit" class="card-btn">
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
          <p class="card-hint">Acesso público, sem necessidade de login</p>
        </div>
      </div>
    </section>

    <section id="features" class="features">
      <div class="section-content">
        <div class="section-header">
          <h2 class="section-title">Tudo que você precisa</h2>
          <p class="section-subtitle">Recursos projetados para o fluxo real de um cartório</p>
        </div>

        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div class="feature-icon">
              <span class="material-symbols-outlined">{{ feature.icon }}</span>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="como-funciona" class="how-it-works">
      <div class="section-content">
        <div class="section-header">
          <h2 class="section-title">Como funciona</h2>
          <p class="section-subtitle">Simples e direto, em três passos</p>
        </div>

        <div class="steps">
          <div v-for="passo in passos" :key="passo.num" class="step">
            <span class="step-num">{{ passo.num }}</span>
            <h3 class="step-title">{{ passo.title }}</h3>
            <p class="step-desc">{{ passo.desc }}</p>
          </div>
        </div>

        <div class="cta-box">
          <div class="cta-content">
            <h3 class="cta-title">Pronto para começar?</h3>
            <p class="cta-subtitle">Entre em contato e descubra como o Cartorial Tech pode otimizar seu cartório</p>
          </div>
          <div class="cta-actions">
            <button @click="abrirWhatsApp" class="btn-primary">
              <span class="material-symbols-outlined">chat</span>
              Falar com Vendas
            </button>
            <router-link to="/consulta" class="btn-outline">
              <span class="material-symbols-outlined">search</span>
              Consultar Processo
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section id="planos" class="planos">
      <div class="section-content">
        <div class="section-header">
          <h2 class="section-title">Planos sob medida</h2>
          <p class="section-subtitle">Escolha a opção ideal para o seu volume de trabalho</p>
        </div>

        <div class="planos-grid">
          <div
            v-for="plano in planos"
            :key="plano.nome"
            class="plano-card"
            :class="{ 'plano-card-destaque': plano.destaque }"
          >
            <span v-if="plano.destaque" class="plano-badge">Mais popular</span>
            <h3 class="plano-nome">{{ plano.nome }}</h3>
            <p class="plano-desc">{{ plano.desc }}</p>
            <ul class="plano-lista">
              <li v-for="recurso in plano.recursos" :key="recurso" class="plano-item">
                <span class="material-symbols-outlined plano-check">check_circle</span>
                {{ recurso }}
              </li>
            </ul>
            <button @click="abrirWhatsApp" class="plano-btn" :class="{ 'plano-btn-destaque': plano.destaque }">
              <span class="material-symbols-outlined">chat</span>
              Contratar
            </button>
          </div>
        </div>

        <div class="planos-contato">
          <span class="material-symbols-outlined planos-contato-icon">support_agent</span>
          <p class="planos-contato-text">
            Tem dúvidas ou precisa de um plano personalizado?
          </p>
          <button @click="abrirWhatsApp" class="planos-contato-btn">
            <span class="material-symbols-outlined">chat</span>
            Falar no WhatsApp
          </button>
        </div>
      </div>
    </section>

    <footer class="landing-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-brand-icon">
            <span class="material-symbols-outlined">gavel</span>
          </div>
          <span class="footer-brand-name">Cartorial Tech</span>
        </div>
        <p class="footer-copy">© 2024 Cartorial Tech. Advanced Notary Advisory Systems.</p>
        <div class="footer-links">
          <a href="#" class="footer-link">Ajuda</a>
          <a href="#" class="footer-link">Termos</a>
          <a href="#" class="footer-link">Privacidade</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Caslon+Text:wght@400;600;700&display=swap');

.landing {
  min-height: 100vh;
  background-color: #faf9f6;
  font-family: 'Inter', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

/* ===== HEADER ===== */
.landing-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(250, 249, 246, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(197, 198, 208, 0.25);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 767px) {
  .header-content {
    padding: 14px 16px;
  }
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: #112752;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon .material-symbols-outlined {
  color: #ffffff;
  font-size: 22px;
}

.brand-name {
  font-family: 'Libre Caslon Text', serif;
  font-size: 20px;
  font-weight: 600;
  color: #112752;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

@media (max-width: 767px) {
  .header-nav {
    gap: 12px;
  }

  .header-nav .nav-link {
    display: none;
  }
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #44464f;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #112752;
}

/* ===== HERO ===== */
.hero {
  position: relative;
  padding: 140px 40px 80px;
  overflow: hidden;
}

@media (max-width: 767px) {
  .hero {
    padding: 100px 16px 48px;
  }
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(17, 39, 82, 0.04) 0%, rgba(207, 181, 59, 0.04) 100%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-content {
    grid-template-columns: 1.2fr 0.8fr;
    gap: 64px;
  }
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 16px;
  background: rgba(207, 181, 59, 0.12);
  border: 1px solid rgba(207, 181, 59, 0.3);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  color: #CFB53B;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hero-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.15;
  color: #112752;
  margin: 0;
}

@media (max-width: 767px) {
  .hero-title {
    font-size: 32px;
  }
}

.hero-title-accent {
  color: #CFB53B;
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: #44464f;
  margin: 0;
  max-width: 540px;
}

@media (max-width: 767px) {
  .hero-subtitle {
    font-size: 15px;
  }
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
}

/* ===== BUTTONS ===== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #112752;
  color: #ffffff;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary .material-symbols-outlined {
  font-size: 20px;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(17, 39, 82, 0.25);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #112752;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 1.5px solid rgba(17, 39, 82, 0.25);
  white-space: nowrap;
}

.btn-secondary .material-symbols-outlined {
  font-size: 20px;
}

.btn-secondary:hover {
  border-color: #112752;
  background: rgba(17, 39, 82, 0.04);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #ffffff;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  white-space: nowrap;
}

.btn-outline .material-symbols-outlined {
  font-size: 20px;
}

.btn-outline:hover {
  border-color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

/* ===== HERO CARD ===== */
.hero-card {
  background: #ffffff;
  border: 1px solid rgba(117, 119, 128, 0.15);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(17, 39, 82, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: rgba(17, 39, 82, 0.08);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #112752;
  font-size: 22px;
}

.card-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 20px;
  font-weight: 600;
  color: #112752;
  margin: 0;
}

.card-desc {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 20px 0;
}

.card-form {
  display: flex;
  gap: 8px;
}

.card-input {
  flex: 1;
  padding: 14px 16px;
  background: #faf9f6;
  border: 1px solid rgba(117, 119, 128, 0.25);
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #112752;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card-input::placeholder {
  color: #9ca3af;
}

.card-input:focus {
  border-color: #112752;
  box-shadow: 0 0 0 3px rgba(17, 39, 82, 0.08);
}

.card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  background: #112752;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.card-btn:hover {
  background: #1a3470;
}

.card-btn .material-symbols-outlined {
  font-size: 22px;
}

.card-hint {
  font-size: 12px;
  color: #9ca3af;
  margin: 16px 0 0 0;
}

/* ===== FEATURES ===== */
.features {
  padding: 80px 40px;
  background: #ffffff;
}

@media (max-width: 767px) {
  .features {
    padding: 48px 16px;
  }
}

.section-content {
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 36px;
  font-weight: 700;
  color: #112752;
  margin: 0 0 8px 0;
}

@media (max-width: 767px) {
  .section-title {
    font-size: 26px;
  }
}

.section-subtitle {
  font-size: 16px;
  color: #6B7280;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.feature-card {
  background: #faf9f6;
  border: 1px solid rgba(117, 119, 128, 0.12);
  border-radius: 14px;
  padding: 28px;
  transition: all 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(17, 39, 82, 0.06);
  border-color: rgba(17, 39, 82, 0.15);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(17, 39, 82, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #112752;
  font-size: 26px;
}

.feature-card:nth-child(even) .feature-icon {
  background: rgba(207, 181, 59, 0.12);
  color: #CFB53B;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 8px 0;
}

.feature-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #6B7280;
  margin: 0;
}

/* ===== HOW IT WORKS ===== */
.how-it-works {
  padding: 80px 40px;
  background: #faf9f6;
}

@media (max-width: 767px) {
  .how-it-works {
    padding: 48px 16px;
  }
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 64px;
}

@media (min-width: 768px) {
  .steps {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 48px;
  }
}

.step {
  text-align: center;
  position: relative;
}

.step-num {
  font-family: 'Libre Caslon Text', serif;
  font-size: 48px;
  font-weight: 700;
  color: rgba(17, 39, 82, 0.12);
  display: block;
  margin-bottom: 12px;
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 8px 0;
}

.step-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #6B7280;
  margin: 0;
}

/* ===== CTA BOX ===== */
.cta-box {
  background: #112752;
  border-radius: 16px;
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

@media (max-width: 767px) {
  .cta-box {
    padding: 32px 24px;
    flex-direction: column;
    text-align: center;
  }
}

.cta-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cta-title {
  font-family: 'Libre Caslon Text', serif;
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

@media (max-width: 767px) {
  .cta-title {
    font-size: 22px;
  }
}

.cta-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.cta-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-actions .btn-primary {
  background: #CFB53B;
  color: #112752;
}

.cta-actions .btn-primary:hover {
  box-shadow: 0 8px 20px rgba(207, 181, 59, 0.3);
}

/* ===== NAV CTA ===== */
.nav-login {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #112752;
  border: 1.5px solid rgba(17, 39, 82, 0.25);
  border-radius: 10px;
  padding: 9px 18px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-login .material-symbols-outlined {
  font-size: 18px;
}

.nav-login:hover {
  border-color: #112752;
  background: rgba(17, 39, 82, 0.04);
}

@media (max-width: 767px) {
  .nav-login {
    padding: 8px 12px;
    font-size: 0;
  }

  .nav-login .material-symbols-outlined {
    font-size: 18px;
  }
}

.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #112752;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-cta .material-symbols-outlined {
  font-size: 18px;
}

.nav-cta:hover {
  background: #1a3470;
  box-shadow: 0 4px 12px rgba(17, 39, 82, 0.2);
}

@media (max-width: 767px) {
  .nav-cta {
    padding: 8px 14px;
    font-size: 12px;
  }

  .nav-cta .material-symbols-outlined {
    font-size: 16px;
  }
}

/* ===== PLANOS ===== */
.planos {
  padding: 80px 40px;
  background: #ffffff;
}

@media (max-width: 767px) {
  .planos {
    padding: 48px 16px;
  }
}

.planos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 48px;
}

@media (min-width: 768px) {
  .planos-grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 32px;
  }
}

.plano-card {
  background: #faf9f6;
  border: 1px solid rgba(117, 119, 128, 0.15);
  border-radius: 16px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.2s;
}

.plano-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(17, 39, 82, 0.08);
}

.plano-card-destaque {
  background: #112752;
  border-color: #112752;
  box-shadow: 0 12px 32px rgba(17, 39, 82, 0.2);
}

.plano-card-destaque:hover {
  box-shadow: 0 16px 40px rgba(17, 39, 82, 0.28);
}

.plano-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #CFB53B;
  color: #112752;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 16px;
  border-radius: 100px;
  white-space: nowrap;
}

.plano-nome {
  font-family: 'Libre Caslon Text', serif;
  font-size: 24px;
  font-weight: 600;
  color: #112752;
  margin: 0 0 4px 0;
}

.plano-card-destaque .plano-nome {
  color: #ffffff;
}

.plano-desc {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 24px 0;
}

.plano-card-destaque .plano-desc {
  color: rgba(255, 255, 255, 0.6);
}

.plano-lista {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.plano-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: #44464f;
}

.plano-card-destaque .plano-item {
  color: rgba(255, 255, 255, 0.85);
}

.plano-check {
  font-size: 20px;
  color: #CFB53B;
  flex-shrink: 0;
  margin-top: -1px;
}

.plano-card-destaque .plano-check {
  color: #CFB53B;
}

.plano-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  color: #112752;
  border: 1.5px solid rgba(17, 39, 82, 0.25);
  border-radius: 12px;
  padding: 14px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.plano-btn .material-symbols-outlined {
  font-size: 20px;
}

.plano-btn:hover {
  border-color: #112752;
  background: rgba(17, 39, 82, 0.04);
}

.plano-btn-destaque {
  background: #CFB53B;
  color: #112752;
  border-color: #CFB53B;
}

.plano-btn-destaque:hover {
  background: #d9c454;
  border-color: #d9c454;
}

.planos-contato {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #faf9f6;
  border: 1px solid rgba(117, 119, 128, 0.12);
  border-radius: 14px;
  padding: 24px 32px;
  flex-wrap: wrap;
}

.planos-contato-icon {
  font-size: 28px;
  color: #CFB53B;
}

.planos-contato-text {
  font-size: 15px;
  color: #44464f;
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.planos-contato-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25D366;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.planos-contato-btn .material-symbols-outlined {
  font-size: 20px;
}

.planos-contato-btn:hover {
  background: #20bd5a;
  box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
}

@media (max-width: 767px) {
  .planos-contato {
    flex-direction: column;
    text-align: center;
    padding: 24px 20px;
  }

  .planos-contato-text {
    min-width: 0;
  }
}

/* ===== FOOTER ===== */
.landing-footer {
  background: #ffffff;
  border-top: 1px solid rgba(197, 198, 208, 0.2);
  padding: 32px 40px;
}

@media (max-width: 767px) {
  .landing-footer {
    padding: 24px 16px;
  }
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-brand-icon {
  width: 28px;
  height: 28px;
  background: #112752;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-brand-icon .material-symbols-outlined {
  color: #ffffff;
  font-size: 16px;
}

.footer-brand-name {
  font-family: 'Libre Caslon Text', serif;
  font-size: 16px;
  font-weight: 600;
  color: #112752;
}

.footer-copy {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  font-size: 12px;
  color: #6B7280;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #112752;
}
</style>