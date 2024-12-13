//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

//对外暴露插件对象
export default {
  //必须叫做install方法
  //会接收我们的app
  //将element-plus提供全部图标注册为全局组件
  install(app) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
