import { createWebHistory, createRouter } from 'vue-router'
import { routes } from './route'
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  // scrollBehavior() {
  //   // 始终滚动到顶部
  //   return { top: 0 }
  // },
  //TODO 怎么回退至原来浏览位置
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { x: 0, y: 0 };
  //   }
  // }
})

//全局前置守卫
router.beforeEach((to, from, next) => {
  next()
})

export default router