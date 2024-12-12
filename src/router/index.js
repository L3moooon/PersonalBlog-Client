import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/view/home/home-index.vue'
import LoginView from '@/view/login/login-index.vue'
import NotFoundView from '@/view/404/not-found-index.vue'

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/404',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router