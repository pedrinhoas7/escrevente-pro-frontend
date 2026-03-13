import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { vMaska } from 'maska/vue' // Import the vMaska directive from maska/vue

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('maska', vMaska) // Register the vMaska directive

app.mount('#app')
