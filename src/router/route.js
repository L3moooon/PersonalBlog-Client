// 路由配置 - 懒加载形式
export const routes = [
  {
    path: "/",
    component: () => import("@/layout/basic/index.vue"),
    redirect: "/home",
    meta: {
      title: "",
      icon: "",
      hidden: true,
    },
    children: [
      {
        path: "/home",
        component: () => import("@/view/home-index.vue"),
        meta: {
          title: "首页",
          icon: "#icon-home",
        },
      },
      // {
      //   path: '/program',
      //   component: () => import('@/view/program-index.vue'),
      //   meta: {
      //     title: '程序设计',
      //     icon: '#icon-chengxuprogram1'
      //   }
      // },
      // {
      //   path: '/note',
      //   component: () => import('@/view/note-index.vue'),
      //   meta: {
      //     title: '学习笔记',
      //     icon: '#icon-note'
      //   }
      // },
      // {
      //   path: '/game',
      //   component: () => import('@/view/live-index.vue'),
      //   meta: {
      //     title: '生活爱好',
      //     icon: '#icon-game'
      //   }
      // },
      {
        path: "/exprience",
        component: () => import("@/view/think-index.vue"),
        meta: {
          title: "随想录",
          icon: "#icon-daifasong",
        },
      },
      // {
      //   path: 'log',
      //   component: () => import('@/view/log-index.vue'),
      //   meta: {
      //     title: '建站日志',
      //     icon: '#icon-rizhi'
      //   }
      // },

      {
        path: "/message",
        component: () => import("@/view/message-index.vue"),
        meta: {
          title: "留言板",
          icon: "#icon-message",
        },
      },
      {
        path: "/link",
        component: () => import("@/view/link-index.vue"),
        meta: {
          title: "友情链接",
          icon: "#icon-link1",
        },
      },
      {
        path: "/about",
        component: () => import("@/view/about/index.vue"),
        meta: {
          title: "关于",
          icon: "#icon-aboutMe",
        },
      },
      {
        path: "/article",
        component: () => import("@/view/article/article-index.vue"),
        meta: {
          title: "",
          icon: "",
          hidden: true,
          // transition: 'slide-fade'
        },
      },
    ],
  },
  {
    path: "/notfound",
    component: () => import("@/layout/NotFoundPage.vue"),
    meta: {
      title: "",
      icon: "",
      hidden: true,
    },
  },
  {
    path: "/:pathMatch(.*)*", // 匹配所有未定义的路由
    redirect: "/notfound",
    meta: {
      hidden: true,
    },
  },
];
