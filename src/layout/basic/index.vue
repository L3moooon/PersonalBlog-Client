<template>
	<div
		class="container"
		id="home-img-container"
	>
		<div class="top">
			<TopBar />
			<div
				class="main"
				v-if="themeStore.TopScreenShow && route.path != '/article'"
			>
				<div class="name">欢迎来访</div>
				<TypeText v-if="isFocus"></TypeText>
				<button
					v-track="{ info: '主页下拉' }"
					@click="turnDownPage"
					class="button"
				>
					主页
				</button>
			</div>
		</div>
		<div class="down">
			<div class="left-container"></div>
			<div class="content-middle">
				<router-view></router-view>
			</div>
			<div
				v-if="themeStore.isDesktop()"
				class="right-container"
			>
				<!-- 文章页-标签面板和目录面板 -->
				<template v-if="route.path == '/article'">
					<el-affix :offset="20">
						<ArticleCatagory />
					</el-affix>
					<ScrollTool />
				</template>
				<!-- 其他页通用 -->
				<template v-else>
					<VisitorCard />
					<WebsiteInfo />
					<el-affix :offset="20">
						<Recommand />
						<TagPanel />
					</el-affix>
				</template>
			</div>
		</div>
		<MusicPlayer />
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";

import VisitorCard from "@/layout/basic/Visitor.vue";
import WebsiteInfo from "@/layout/basic/WebInfo.vue";
import ArticleCatagory from "@/view/article/CatagoryPanel.vue";
import Recommand from "@/layout/basic/Recommand.vue";
import TagPanel from "@/layout/basic/TagPanel.vue";
import TypeText from "@/layout/basic/TypeText.vue";
import TopBar from "@/layout/basic/TopBar.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
import ScrollTool from "@/components/ScrollTool.vue";
import { throttle } from "lodash";
import { useThemeStore } from "@/store/theme";

const themeStore = useThemeStore();
const route = useRoute();
const isFocus = ref(true); //控制打字机仅在前台时显示

const turnDownPage = () => {
	window.scrollTo({
		top: window.innerHeight + 1,
		behavior: "smooth", // 平滑滚动效果
	});
};
// 滚动到内容区时销毁上半屏
const handleScroll = () => {
	// 获取top区域的高度
	const topElement = document.querySelector(".top");
	const topWrapper = document.getElementById("topbar-menu");
	if (!topElement) return; // 避免元素未加载时的错误
	const topHeight = topElement.offsetHeight;
	// 滚动距离超过top高度时，销毁top
	if (window.scrollY > topHeight) {
		setTimeout(() => {
			// showTop.value = false;
			themeStore.setTopStatus(false);
		}, 100);
		topWrapper.classList.add("bg-white");
	}
};
const throttledHandleScroll = throttle(handleScroll, 200);
// 处理页面可见性变化
const handleVisibilityChange = () => {
	isFocus.value = !document.hidden;
};

onMounted(() => {
	// sendInfo();
	handleScroll(); //先判断一次
	window.addEventListener("scroll", throttledHandleScroll);
	document.addEventListener("visibilitychange", handleVisibilityChange);
});
onUnmounted(() => {
	window.removeEventListener("scroll", throttledHandleScroll);
	document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<style lang="scss" scoped>
// 全局变量
$font-display: SiJiYuNi; // 展示类字体
$radius-main: 10px; // 主要圆角
$radius-large: 30px; // 大圆角
$shadow-btn: 10px; // 按钮阴影
$space-padding-top: 80px; // 桌面端底部区域上内边距
$space-padding-top-mobile: 60px; // 移动端底部区域上内边距

// 按钮颜色变量（按设备区分）
$btn-desktop-bg: #e9c669;
$btn-desktop-border: #e0be6e;
$btn-mobile-bg: #4489ca;
$btn-mobile-border: #609ed6;

// 公共基础样式
.container {
	user-select: none;
	background-size: cover;
	background-repeat: no-repeat;
	background-attachment: fixed;
}

// 顶部区域公共样式
.top {
	.main {
		width: 100%;
		height: 100vh;
		padding: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: $radius-large;
		font-family: $font-display;
		.name {
			font-size: 64px;
			font-weight: 500;
		}
		.button {
			cursor: pointer;
			font-family: $font-display;
			font-size: 20px;
			color: #fff;
			height: 40px;
			width: 100px;
			border-radius: 5px;
			font-weight: 500;
			margin: 1rem auto;
			border: 1px solid;
			box-shadow: $shadow-btn;
			display: block;
		}
	}
}

// 底部内容区公共样式
.down {
	min-height: 100vh;
	margin: 0 auto;
	box-sizing: border-box;
	.content-middle {
		margin-bottom: 20px;
		overflow: hidden;
	}
}

// 桌面端样式
@media (min-width: 768px) {
	.container {
		background-image: url("@/assets/bamboo.jpg");
	}
	.top {
		.main {
			color: #fff; // 桌面端顶部文字白色
			.button {
				background-color: $btn-desktop-bg;
				border-color: $btn-desktop-border;
			}
		}
	}
	.down {
		display: flex;
		padding-top: $space-padding-top;
		width: 80%;
		gap: 20px;
		max-width: 1280px;
		min-width: 1080px;
		.left-container {
			width: 200px;
		}
		.content-middle {
			flex: 1;
			background-color: #fff;
			border-radius: $radius-main;
		}
		.right-container {
			width: 250px;
		}
	}
}

// 移动端样式
@media (max-width: 768px) {
	.container {
		background-image: url("@/assets/img/mobile-bg.jpg");
	}
	.top {
		color: #fff; // 移动端顶部文字白色
		.main {
			.button {
				background-color: $btn-mobile-bg;
				border-color: $btn-mobile-border;
				position: absolute; // 移动端按钮固定在底部
				bottom: 20px;
			}
		}
	}
	.down {
		padding-top: $space-padding-top-mobile;
		width: 100%;
		.content-middle {
			height: 100%; // 移动端内容区占满高度
		}
	}
	// 导航栏背景切换样式
	.bg-white {
		color: #555;
		background-color: #fff;
		transition: 0.3s;
	}
}
</style>
