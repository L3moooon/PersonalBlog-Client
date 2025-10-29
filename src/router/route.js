// 路由配置 - 懒加载形式
export const routes = [
	{
		path: "/",
		component: () => import("@/layout/basic/index.vue"),
		redirect: "/home",
		children: [
			{
				path: "/home",
				component: () => import("@/view/main/index.vue"),
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

			// {
			//   path: 'log',
			//   component: () => import('@/view/log-index.vue'),
			//   meta: {
			//     title: '建站日志',
			//     icon: '#icon-rizhi'
			//   }
			// },
			{
				path: "/article",
				component: () => import("@/view/article/article-index.vue"),
			},
			{
				path: "/tagCloud",
				component: () => import("@/layout/tag/index.vue"),
			},
		],
	},
	// {
	// 	path: "/exprience",
	// 	component: () => import("@/view/think-index.vue"),
	// },
	// {
	// 	path: "/message",
	// 	component: () => import("@/layout/message/index.vue"),
	// },
	// {
	// 	path: "/link",
	// 	component: () => import("@/view/link-index.vue"),
	// },
	// {
	// 	path: "/about",
	// 	component: () => import("@/view/about/index.vue"),
	// },
	{
		path: "/notfound",
		component: () => import("@/layout/NotFoundPage.vue"),
	},
	{
		path: "/:pathMatch(.*)*", // 匹配所有未定义的路由
		redirect: "/notfound",
	},
];
