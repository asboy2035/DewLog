import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router.ts'
import '@/styles/global.sass'

const ashSpp = createApp(App)

ashSpp
  .use(createPinia())
  .use(router)
  .mount('#app')
