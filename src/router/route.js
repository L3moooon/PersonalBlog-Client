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
				path: "/about",
				component: () => import("@/view/about/index.vue"),
			},
			{
				path: "/message",
				component: () => import("@/view/message/index.vue"),
			},
			{
				path: "/friendship",
				component: () => import("@/view/friendship/index.vue"),
			},
		],
	},
	{
		path: "/:pathMatch(.*)*", // 匹配所有未定义的路由
		redirect: "/home",
	},
];
