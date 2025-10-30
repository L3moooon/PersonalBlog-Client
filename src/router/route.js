// 路由配置
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
			{
				path: "/article",
				component: () => import("@/view/article/index.vue"),
			},
			{
				path: "/tagCloud",
				component: () => import("@/view/tag/index.vue"),
			},
		],
	},
	{
		path: "/notfound",
		component: () => import("@/layout/NotFoundPage.vue"),
	},
	{
		path: "/:pathMatch(.*)*", // 匹配所有未定义的路由
		redirect: "/notfound",
	},
];
