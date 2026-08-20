import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '../pages/Login.vue';
import Dashboard from '../pages/Dashboard.vue';
import Clientes from '../pages/Clientes.vue';
import Processos from '../pages/Processos.vue';
import DetalhesProcesso from '../pages/DetalhesProcesso.vue';
import EditarProcesso from '../pages/EditarProcesso.vue';
import EditarCliente from '../pages/EditarCliente.vue';
import GestaoEscreventes from '../pages/GestaoEscreventes.vue';
import GestaoUsuarios from '../pages/GestaoUsuarios.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import DefinirSenha from '../pages/DefinirSenha.vue';
import ConsultaProtocolo from '../pages/ConsultaProtocolo.vue';
import HistoricoProcesso from '../pages/HistoricoProcesso.vue';
import RelatorioComissoes from '../pages/RelatorioComissoes.vue';
import RelatorioProcessos from '../pages/RelatorioProcessos.vue';
import LandingPage from '../pages/LandingPage.vue';
import MainLayout from '../layouts/MainLayout.vue';
import { useAuthStore } from '../stores/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/consulta',
    name: 'ConsultaProtocolo',
    component: ConsultaProtocolo
  },
  {
    path: '/consulta/:protocolo',
    name: 'HistoricoProcesso',
    component: HistoricoProcesso
  },
  {
    path: '/definir-senha',
    name: 'DefinirSenha',
    component: DefinirSenha
  },
  {
    path: '/app',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/app/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'clientes',
        name: 'Clientes',
        component: Clientes,
      },
      {
        path: 'clientes/:id/editar',
        name: 'EditarCliente',
        component: EditarCliente,
      },
      {
        path: 'escreventes',
        name: 'GestaoEscreventes',
        component: GestaoEscreventes,
      },
      {
        path: 'admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'admin/usuarios',
        name: 'GestaoUsuarios',
        component: GestaoUsuarios,
      },
      {
        path: 'processos',
        name: 'Processos',
        component: Processos,
      },
      {
        path: 'processos/:id',
        name: 'DetalhesProcesso',
        component: DetalhesProcesso,
      },
      {
        path: 'processos/:id/editar',
        name: 'EditarProcesso',
        component: EditarProcesso,
      },
      {
        path: 'relatorios',
        redirect: '/app/relatorios/processos',
      },
      {
        path: 'relatorios/comissoes',
        name: 'RelatorioComissoes',
        component: RelatorioComissoes,
      },
      {
        path: 'relatorios/processos',
        name: 'RelatorioProcessos',
        component: RelatorioProcessos,
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log(to, from)
    if (savedPosition) {
      return savedPosition; 
    } else {
      return { top: 0 }; 
    }
  }
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/') && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next('/app/admin');
    } else {
      next('/app/dashboard');
    }
  } else if (to.path === '/app/dashboard' && authStore.isAdmin) {
    next('/app/admin');
  } else {
    next();
  }
});

export default router;
