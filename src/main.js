import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "@/router/index";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

import Monitor from "./utils/monitor";
import PerformanceMonitor from "./utils/performance";

import directives from "./directives"; // 导入所有指令
import "./utils/rem"; // 引入rem适配
import "./utils/importSvg"; // 引入svg图标
import SvgComponent from "@/components/SvgComponent.vue";
// 初始化监控（全局生效）
// new Monitor();
// new PerformanceMonitor()//性能监控

const pinia = createPinia();
const app = createApp(App);
app.use(ElementPlus, {
	locale: zhCn,
});
//注册全局指令
Object.keys(directives).forEach((key) => {
	app.directive(key, directives[key]);
});
//注册全局组件
app.component("SvgComponent", SvgComponent);
app.use(router);
app.use(pinia);
app.mount("#app");
