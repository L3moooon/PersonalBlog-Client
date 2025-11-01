import App from "./App.vue";
import router from "@/router/index";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import Tracker from "./utils/tracker";
import directives from "./directives"; // 导入所有指令

import SvgComponent from "@/components/SvgComponent.vue";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { throttledSetRem } from "./utils/rem";

const pinia = createPinia();
const app = createApp(App);

// 初始化监控（全局生效）
export const tracker = new Tracker();

//改变窗口大小时重新设置 rem
window.onresize = throttledSetRem;

// 自动导入所有svg文件，生成雪碧图
const allSvg = require.context("@/assets/svg", true, /\.svg$/);
allSvg.keys().forEach(allSvg);

//注册全局指令
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
