import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import "@/styles/icon.css"
import '@/font/iconfont'
import { createPinia } from 'pinia'
import '@/utils/rem'
const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router)
app.use(pinia)
app.mount('#app')
