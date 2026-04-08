import { createRouter, createWebHashHistory } from 'vue-router'
import Bienvenida from '../components/Bienvenida.vue'
import Descubre from '../components/Descubre.vue'
import Funcionalidades from '../components/Funcionalidades.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Bienvenida
  },
  {
    path: '/descubre',
    name: 'Descubre',
    component: Descubre
  },
  {
    path: '/funcionalidades',
    name: 'Funcionalidades',
    component: Funcionalidades
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
