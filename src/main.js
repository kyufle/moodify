import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

const app = createApp(App)
app.use(router)
app.use(i18n)

// Depuración
router.afterEach((to) => {
  console.log('Navegado a:', to.path, 'Nombre:', to.name)
})
window.router = router
window.app = app

app.mount('#app')
