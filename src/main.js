import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

// Depuración
router.afterEach((to) => {
  console.log('Navegado a:', to.path, 'Nombre:', to.name)
})
window.router = router
window.app = app

app.mount('#app')
