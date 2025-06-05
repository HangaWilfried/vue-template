import { createApp } from 'vue'

import '@/assets/main.css'
import App from '@/App.vue'
import router from '@/router'
import loginProvider from '@/plugins/authProvider'

const keycloakAuth = loginProvider()

const bootstrap = () => {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

keycloakAuth.init().then(bootstrap)
