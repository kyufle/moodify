import { createRouter, createWebHistory } from 'vue-router'
import Bienvenida from '../components/Bienvenida.vue'
import Descubre from '../components/Descubre.vue'
import Funcionalidades from '../components/Funcionalidades.vue'
import Demo from '../components/Demo.vue'

import Origen from '../components/Origen.vue'
import Bloom from '../components/Bloom.vue'
import Tecnologia from '../components/Tecnologia.vue'

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
    path: '/origen',
    name: 'Origen',
    component: Origen
  },
  {
    path: '/demo',
    name: 'Demo',
    component: Demo
  },
  {
    path: '/bloom',
    name: 'Bloom',
    component: Bloom
  },
  {
    path: '/tecnologia',
    name: 'Tecnologia',
    component: Tecnologia
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
