<template>
	<div
		class="wrapper flex-between"
		id="topbar-menu"
		ref="wrapperRef"
		@mouseenter="mouseenter"
		@mouseleave="mouseLeave"
	>
		<div
			v-if="route.path == '/home'"
			class="left flex-center"
		>
			<img
				class="top-img"
				src="@/assets/portrait.jpg"
			/>
			<div class="name">宵时雨</div>
		</div>
		<div
			v-else
			class="left flex-center"
			@click="goRoute('/')"
		>
			<div class="back-icon">
				<SvgComponent
					icon="back"
					className="icon"
				/>
			</div>
			<div class="back-text">返回</div>
		</div>
		<div class="right flex-center">
			<template v-if="themeStore.isDesktop()">
				<!-- <div @click="mention">主题切换</div> -->
				<div
					@click="searchDialogVisible = true"
					class="flex-center func"
				>
					<SvgComponent
						className="icon search-icon"
						icon="search"
					/>
					<div>搜索</div>
				</div>
				<!-- <el-popover
					class="box-item"
					:offset="20"
					placement="top-start"
					trigger="click"
				>
					<template #reference>
						<div
							@click="mention"
							class="flex-center func"
						>
							<SvgComponent
								className="icon"
								icon="folder"
							/>
							<div>归档</div>
						</div>
					</template>
					<template>
						<div>技术</div>
						<div>游戏</div>
						<div>健身</div>
					</template>
				</el-popover> -->
				<div
					@click="goRoute('/message')"
					class="flex-center func"
				>
					<SvgComponent
						className="icon"
						icon="send"
					/>
					<div>留言</div>
				</div>
				<div
					@click="mention"
					class="flex-center func"
				>
					<SvgComponent
						className="icon"
						icon="link"
					/>
					<div>友情链接</div>
				</div>
				<div
					@click="goRoute('/about')"
					class="flex-center func"
				>
					<SvgComponent
						className="icon"
						icon="document"
					/>
					<div>关于</div>
				</div>
			</template>
			<template v-if="themeStore.isMobile()">
				<img
					class="mobile-menu"
					src="@/assets/icons/catalogue.png"
					alt=""
					@click="drawer = true"
				/>
				<el-input
					v-model="inputValue"
					class="input"
					placeholder="搜索本站"
				>
					<template #prefix>
						<SvgComponent
							className="icon"
							icon="search"
						/>
					</template>
				</el-input>
				<el-drawer
					v-model="drawer"
					direction="ltr"
					size="50%"
					title="I am the title"
					:lock-scroll="false"
				>
					<span>Hi there!</span>
				</el-drawer>
			</template>
		</div>
	</div>
	<div
		class="wrapper-placeholder"
		@mouseenter="placeholderMouseenter"
	></div>
	<el-dialog
		v-model="searchDialogVisible"
		:lock-scroll="false"
		:show-close="false"
		class="search-dialog"
	>
		<template #title>
			<div class="title-text">搜索</div>
			<div class="shortcut-container">
				<SvgComponent
					className="search-icon shortcut"
					icon="shortcut"
				/>
				CTRL+K
			</div>
		</template>
		<el-input
			v-model="inputValue"
			@input="throttleHandleSearch"
			class="input"
			:autofocus="true"
			placeholder="搜索本站"
		>
			<template #prefix>
				<SvgComponent
					className="icon search-icon"
					icon="search"
				/>
			</template>
		</el-input>
		<el-scrollbar
			height="400"
			v-loading="loading"
			v-if="searchList.length"
			class="scroll"
		>
			<div class="result-area">
				<el-card
					class="item flex"
					v-for="item in searchList"
					@click="handleSearchClick(item.id)"
				>
					<div class="circle flex-center">
						<div class="inner"></div>
					</div>

					<div class="content">
						<div class="top flex-between">
							<div class="title">{{ item.title }}</div>
							<div
								class="time"
								v-timeFormatter="item.publish_date"
							></div>
						</div>
						<div class="bottom">
							{{ item.abstract }}
							<div v-html="item.content"></div>
						</div>
					</div>
				</el-card>
			</div>
		</el-scrollbar>

		<el-empty
			v-else
			description="暂无内容"
		/>
	</el-dialog>
</template>

<script setup>
import { onMounted, ref, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { throttle } from "lodash";
import { ElMessage } from "element-plus";
import { useThemeStore } from "@/store/theme";
import { getSearchData } from "@/api/home";
import SvgComponent from "@/components/SvgComponent.vue";

let removeResizeListener;

const themeStore = useThemeStore();
const route = useRoute();
const router = useRouter();
const drawer = ref(false);
const inputValue = ref("");
const wrapperRef = ref(null);

const searchDialogVisible = ref(false);
const loading = ref(false);

const goRoute = (path) => {
	router.push(path);
	// const commentPanel = document.getElementById("comment-panel");
	// if (commentPanel) {
	// 	commentPanel.scrollIntoView({ behavior: "smooth" });
	// }
	// nextTick(() => {});
};
function showOrHide(e) {
	// 下滑
	if (e.deltaY > 0) {
		wrapperRef.value?.classList.add("hide");
		wrapperRef.value?.classList.remove("show");
	}
	// 上滑
	else {
		if (window.scrollY <= 80) {
			wrapperRef.value?.classList.add("show");
			wrapperRef.value?.classList.remove("hide");
		}
	}
}
const throttledShowOrHide = throttle(showOrHide, 100);
//光标进入时显示并添加遮罩层
const mouseenter = (e) => {
	e.stopPropagation();
	e.preventDefault();
	wrapperRef.value?.classList.add("backdrop-filter");
	wrapperRef.value?.classList.add("show");
	wrapperRef.value?.classList.remove("hide");
};
//光标离开时
//在初屏位置就t关闭滤镜
//不在就隐藏顶部栏并关闭滤镜
const mouseLeave = () => {
	//console.log(window.scrollY);
	if (window.scrollY > 80) {
		// 触发隐藏动画
		wrapperRef.value?.classList.add("hide");
		wrapperRef.value?.classList.remove("show");
	}
	wrapperRef.value?.classList.remove("backdrop-filter");
};
const placeholderMouseenter = () => {
	wrapperRef.value?.classList.add("show");
	wrapperRef.value?.classList.remove("hide");
};

const mention = () => {
	ElMessage.info("敬请期待");
};

const handleOpenSearch = (event) => {
	if (event.ctrlKey && event.key.toLowerCase() === "k") {
		event.preventDefault();
		searchDialogVisible.value = !searchDialogVisible.value;
	}
};
const searchList = ref([]);

const handleSearch = async () => {
	if (!inputValue.value) {
		searchList.value = [];
		return;
	}
	loading.value = true;
	const { data, code } = await getSearchData({ keyword: inputValue.value });
	console.log(data);
	if (code == 1) {
		searchList.value = data;
	}
	loading.value = false;
};
const throttleHandleSearch = throttle(handleSearch, 300);
const handleSearchClick = (id) => {
	goRoute(`/article?id=${id}`);
	searchDialogVisible.value = false;
};

onMounted(() => {
	window.addEventListener("wheel", throttledShowOrHide);
	window.addEventListener("keydown", handleOpenSearch);
	removeResizeListener = themeStore.listenResize();
});
onUnmounted(() => {
	window.removeEventListener("wheel", throttledShowOrHide);
	window.removeEventListener("keydown", handleOpenSearch);
	if (removeResizeListener) removeResizeListener();
});
</script>

<style lang="scss" scoped>
// 公共动画定义（提取到顶部统一管理）
@keyframes slideDown {
	from {
		transform: translateY(-100%);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}
@keyframes slideUp {
	from {
		transform: translateY(0);
		opacity: 1;
	}
	to {
		transform: translateY(-100%);
		opacity: 0;
	}
}
@keyframes fadeInBg {
	from {
		background-color: rgba(0, 0, 0, 0);
	}
	to {
		background-color: rgba(0, 0, 0, 0.3);
	}
}
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
// 搜索结果区域样式（独立模块）
.scroll {
	width: calc(100% + 10px);
	margin-top: 10px;
}
.result-area {
	width: calc(100% - 10px);
	overflow: hidden;
	margin: 5px 0;
}
.circle {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: #49b1f5;
	.inner {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background-color: #fff;
	}
}
.item {
	cursor: pointer;
	display: flex;
	&:not(:last-child) {
		margin-bottom: 10px;
	}
	.content {
		width: calc(100% - 20px);
		margin-left: 15px;
		.top {
			width: 100%;
			font-size: 16px;
			margin-bottom: 10px;
			display: flex;
			justify-content: space-between;
			.title {
			}
			.time {
				color: #a8abb2;
			}
		}
		.bottom {
		}
	}
}

// 桌面端样式（≥768px）
@media (min-width: 768px) {
	.wrapper-placeholder {
		width: 100%;
		height: 60px;
		position: fixed;
		top: 0;
		z-index: 99;
	}
	.backdrop-filter {
		transition: 0.3s;
		backdrop-filter: blur(5px);
		animation: fadeInBg 0.3s ease-out forwards;
	}
	.wrapper {
		width: 100%;
		height: 60px;
		position: fixed;
		top: 0;
		z-index: 999;
		transition: 0.3s;
		color: white;
		background-color: rgba(0, 0, 0, 0);
		animation: slideDown 0.5s ease-out forwards;
		&.show {
			animation: slideDown 0.5s ease-out forwards;
		}
		&.hide {
			animation: slideUp 0.5s ease-out forwards;
		}
		.left {
			cursor: pointer;
			height: 100%;
			margin-left: 20px;
			display: flex;
			align-items: center;
			animation: fadeIn 0.6s ease-out;
			.top-img {
				width: 50px;
				border-radius: 5px;
			}
			.back-text {
				font-size: 20px;
				margin-left: 10px;
			}
			.name {
				color: white;
				margin: 0 12px 0 18px;
			}
		}
		.right {
			display: flex;
			justify-content: flex-end;
			gap: 20px;
			animation: fadeIn 0.8s ease-out;
			margin-right: 20px;
			.func {
				cursor: pointer;
				padding: 7px 10px;
				border-radius: 5px;
				transition: 0.3s;
				display: flex;
				align-items: center;
				&:hover {
					background-color: #1f5a5c;
					transition: 0.3s;
				}
			}
			.icon {
				width: 20px;
				height: 20px;
				margin-right: 10px;
				display: block;
				color: #fff;
			}
			.input {
				width: 180px;
				margin-right: 20px;
				.search-icon {
					color: #a8abb2;
				}
			}
		}
	}
}

// 移动端样式（≤768px）
@media (max-width: 768px) {
	.wrapper {
		width: 100%;
		height: 60px;
		position: fixed;
		top: 0;
		z-index: 999;
		transition: 0.3s;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.right {
			order: 1;
			.mobile-menu {
				width: 25px;
				margin: 0 10px;
			}
		}
		.left {
			order: 2;
			display: flex;
			align-items: center;
			.top-img {
				width: 50px;
				border-radius: 50%;
				margin: 5px 10px;
			}
			.name {
				margin-right: 10px;
			}
		}
		.search-icon {
			width: 20px;
			height: 20px;
		}
		.input {
			width: 180px;
			margin-left: 10px;
		}
	}
}
</style>

<style>
.el-dialog.search-dialog {
	width: 600px;
	.el-dialog__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title-text {
			font-size: 20px;
			font-weight: bold;
		}
		.shortcut-container {
			color: #a8abb2;
			display: flex;
			justify-content: center;
			align-items: center;
			.shortcut {
				width: 15px;
				height: 15px;
				margin-right: 5px;
			}
		}
	}
	.el-card {
		.el-card__body {
			padding: 10px;
			display: flex;
		}
		em {
			color: red;
		}
	}
}
</style>
