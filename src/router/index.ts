import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '../pages/Login.vue';
import Dashboard from '../pages/Dashboard.vue';
import Clientes from '../pages/Clientes.vue';
import Processos from '../pages/Processos.vue';
import NovoProcesso from '../pages/NovoProcesso.vue';
import DetalhesProcesso from '../pages/DetalhesProcesso.vue';
import ConsultaProtocolo from '../pages/ConsultaProtocolo.vue';
import HistoricoProcesso from '../pages/HistoricoProcesso.vue';
import MainLayout from '../layouts/MainLayout.vue';
import { useAuthStore } from '../stores/auth';

const routes: Array<RouteRecordRaw> = [
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
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
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
        path: 'processos',
        name: 'Processos',
        component: Processos,
      },
      {
        path: 'processos/novo',
        name: 'NovoProcesso',
        component: NovoProcesso,
      },
      {
        path: 'processos/:id',
        name: 'DetalhesProcesso',
        component: DetalhesProcesso,
      },
    ]
  },
  // Rota catch-all para 404 (opcional, redirecionando para login)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
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
  } else {
    next();
  }
});

export default router;
