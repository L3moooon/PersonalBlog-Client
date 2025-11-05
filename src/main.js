import App from "./App.vue";
import router from "@/router/index";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import Tracker from "./utils/tracker";
import WebSocketService from "./utils/webSocket";
import directives from "./directives";

import SvgComponent from "@/components/SvgComponent.vue";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { throttledSetRem } from "./utils/rem";
import { checkAndCleanLocalStorage } from "./utils/checkVersion";

const app = createApp(App);
const pinia = createPinia();

// 初始化监控（全局生效）
export const tracker = new Tracker();

//初始化webSocket
const wsService = new WebSocketService();
app.config.globalProperties.$ws = wsService;
wsService.connect();

//改变窗口大小时重新设置 rem
window.onresize = throttledSetRem;

//检查版本并清除无用的本地缓存
checkAndCleanLocalStorage();

// 自动导入所有svg文件，生成雪碧图
const allSvg = require.context("@/assets/svg", true, /\.svg$/);
allSvg.keys().forEach(allSvg);

//集中注册全局指令
Object.keys(directives).forEach((key) => {
	app.directive(key, directives[key]);
});

//注册全局组件
app.component("SvgComponent", SvgComponent);

app.use(router);
app.use(pinia);
app.use(ElementPlus, {
	locale: zhCn,
});

app.mount("#app");
