import { createWebHistory, createRouter } from 'vue-router'
import { routes } from './route'
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     // 如果有保存的滚动位置，则恢复
  //     console.log('有保存的滚动位置', savedPosition);
  //     return savedPosition;
  //   } else if (to.hash) {
  //     // 如果有哈希值，滚动到对应的锚点
  //     console.log('哈希值');
  //     return { el: to.hash };
  //   } else {
  //     // 否则滚动到顶部
  //     console.log('滚动到顶');
  //     return { top: 0 };
  //   }
  // },

  // 全局滚动行为配置
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  }
})
//全局前置守卫
router.beforeEach((to, from, next) => {
  console.log(to, from);
  next()
})

export default router