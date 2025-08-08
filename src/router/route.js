// 路由配置 - 懒加载形式
export const routes = [
  {
    path: '/',
    component: () => import('@/layout/HomePage.vue'),
    redirect: '/home',
    meta: {
      title: '',
      icon: '',
      hidden: true
    },
    children: [
      {
        path: '/home',
        component: () => import('@/view/main-index.vue'),
        meta: {
          title: '首页',
          icon: '#icon-home'
        }
      },
    ]
  },
  {
    path: '/tech',
    component: () => import('@/layout/HomePage.vue'),
    redirect: '/program',  // 修正了原 redirect 路径错误
    meta: {
      title: '技术相关',
      icon: '#icon-banshou'
    },
    children: [
      {
        path: '/program',
        component: () => import('@/view/tech/program-index.vue'),
        meta: {
          title: '程序设计',
          icon: '#icon-chengxuprogram1'
        }
      },
      {
        path: '/note',
        component: () => import('@/view/tech/note-index.vue'),
        meta: {
          title: '学习笔记',
          icon: '#icon-note'
        }
      },
    ]
  },
  {
    path: '/live',
    component: () => import('@/layout/HomePage.vue'),
    redirect: '/game',  // 修正了原 redirect 路径错误
    meta: {
      title: '生活相关',
      icon: '#icon-icon'
    },
    children: [
      {
        path: '/game',
        component: () => import('@/view/live/live-index.vue'),
        meta: {
          title: '生活爱好',
          icon: '#icon-game'
        }
      },
      {
        path: '/exprience',
        component: () => import('@/view/live/think-index.vue'),
        meta: {
          title: '随想录',
          icon: '#icon-daifasong'
        }
      },
    ]
  },
  {
    path: '/catagroy',
    component: () => import('@/layout/HomePage.vue'),
    meta: {
      title: '',
      icon: '',
      hidden: true
    },
    children: [
      {
        path: 'log',
        component: () => import('@/view/log-index.vue'),
        meta: {
          title: '建站日志',
          icon: '#icon-rizhi'
        }
      },
    ]
  },
  {
    path: '/aboutme',
    component: () => import('@/view/aboutme-index.vue'),
    meta: {
      title: '关于我',
      icon: '#icon-aboutMe'
    }
  },
  {
    path: '/message',
    component: () => import('@/view/message-index.vue'),
    meta: {
      title: '留言板',
      icon: '#icon-message'
    }
  },
  {
    path: '/link',
    component: () => import('@/view/link-index.vue'),
    meta: {
      title: '友情链接',
      icon: '#icon-link1'
    }
  },
  {
    path: '/article',
    component: () => import('@/layout/ArticlePage.vue'),
    meta: {
      title: '',
      icon: '',
      hidden: true,
      // transition: 'slide-fade'
    }
  },
  {
    path: '/notfound',
    component: () => import('@/layout/NotFoundPage.vue'),
    meta: {
      title: '',
      icon: '',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',  // 匹配所有未定义的路由
    redirect: '/notfound',
    meta: {
      hidden: true
    }
  }
]
