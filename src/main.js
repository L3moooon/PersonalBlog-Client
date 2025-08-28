import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router/index'
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

import Monitor from './utils/monitor';
import directives from './directives'; // 导入所有指令

// 初始化监控（全局生效）
// new Monitor();

const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
});
// 批量注册指令（指令名即对象key，如v-date、v-permission）
Object.keys(directives).forEach(key => {
  app.directive(key, directives[key]);
});
app.use(router)
app.use(pinia)
app.mount('#app')
