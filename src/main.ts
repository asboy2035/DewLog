import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import router from '@/router.ts'
import '@/styles/global.sass'

const DewLogApp = createApp(App)
const DewLogPinia = createPinia()

DewLogPinia
  .use(piniaPluginPersistedstate)

DewLogApp
  .use(DewLogPinia)
  .use(router)
  .mount('#app')
