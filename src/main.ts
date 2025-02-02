// import './assets/main.css'
import 'ant-design-vue/dist/reset.css'
import 'vue-json-pretty/lib/styles.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
