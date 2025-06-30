import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/styles/global.sass'

// Create the Vue application instance
const hydroFlowApp = createApp(App)
// Create the Pinia store instance
const pinia = createPinia()

hydroFlowApp
  .use(pinia)
  .mount('#app')

// Register service worker for PWA and push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope)
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error)
      })
  })
}
