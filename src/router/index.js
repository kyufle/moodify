import { createRouter, createWebHistory } from 'vue-router'
import Bienvenida from '../components/Bienvenida.vue'
import Descubre from '../components/Descubre.vue'
import Funcionalidades from '../components/Funcionalidades.vue'
import Demo from '../components/Demo.vue'

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
  },
  {
    path: '/demo',
    name: 'Demo',
    component: Demo
  }
]

const router = createRouter({
  history: createWebHistory(),
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
