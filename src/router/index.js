import { createWebHistory, createRouter } from 'vue-router'
import { routes } from './route'
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  // scrollBehavior() {
  //   // 始终滚动到顶部
  //   return { top: 0 }
  // },
})

export default router