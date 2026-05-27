import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

// Global SCSS — resets, typography, animations, layout helpers
import './styles/main.scss'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())  // state management
app.use(router)         // page routing

app.mount('#app')
