<template>
	<div class="tool-container">
		<div
			class="item flex-center"
			v-for="item in computedData"
			@click="item.func"
		>
			<el-tooltip
				class="box-item"
				effect="light"
				:content="item.desc"
				placement="left"
				:show-arrow="false"
			>
				<SvgComponent
					:icon="item.iconName"
					:className="['icon', item.iconName]"
				/>
			</el-tooltip>
		</div>
	</div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

// const showMore = ref(false);
const data = [
	{ iconName: "fullscreen", func: () => toggleFullscreen(), desc: "全屏" },
	{ iconName: "switch", func: () => mention(), desc: "切换主题" },
	// {
	// 	iconName: "more",
	// 	func: () => (showMore.value = true),
	// 	desc: "更多功能",
	// },
	// { iconName: "route-back", func: () => routerBack(), desc: "返回" },
	{ iconName: "top", func: () => scrollToTop(), desc: "回到顶部" },
	{ iconName: "down", func: () => scrollToDown(), desc: "回到底部" },
];
const computedData = computed(() => {
	if (route.path == "/home")
		return data.filter((v) => v.iconName != "route-back");
	else return data;
});
// 新增全屏切换函数
const toggleFullscreen = () => {
	const doc = window.document;
	const docEl = doc.documentElement;
	const requestFullScreen =
		docEl.requestFullscreen ||
		docEl.mozRequestFullScreen ||
		docEl.webkitRequestFullscreen ||
		docEl.msRequestFullscreen;
	const exitFullScreen =
		doc.exitFullscreen ||
		doc.mozCancelFullScreen ||
		doc.webkitExitFullscreen ||
		doc.msExitFullscreen;

	if (
		!doc.fullscreenElement &&
		!doc.mozFullScreenElement &&
		!doc.webkitFullscreenElement &&
		!doc.msFullscreenElement
	) {
		requestFullScreen.call(docEl);
	} else {
		exitFullScreen.call(doc);
	}
};
//滚动到顶部
const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};
//滚动到底部
const scrollToDown = () => {
	const scrollHeight =
		document.documentElement.scrollHeight || document.body.scrollHeight;
	window.scrollTo({
		top: scrollHeight, // 滚动到文档最底部
		behavior: "smooth",
	});
};
//滚动到评论区
// const scrollToComments = () => {
// 	const commentPanel = document.getElementById("comment-panel");
// 	if (commentPanel) {
// 		commentPanel.scrollIntoView({ behavior: "smooth" });
// 	}
// };
//返回上一页
const routerBack = () => {
	router.back();
};
const mention = () => {
	ElMessage.info("开发中，敬请期待！");
};
</script>

<style lang="scss" scoped>
.tool-container {
	position: fixed;
	border-radius: 10px 0 0 10px;
	bottom: 40px;
	right: 0;
	background-color: transparent;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	gap: 5px;
	.item {
		cursor: pointer;
		background-color: #1f5a5c;
		width: 35px;
		height: 35px;
	}
	.icon {
		width: 25px;
		height: 25px;
		color: #fff;
		transition: 0.3s;
		font-weight: bold;
		&:hover {
			transform: scale(1.1);
			transition: 0.3s;
		}
		&:focus {
			outline: none;
		}
	}
	.route-back {
		width: 30px;
		height: 30px;
	}
}
</style>
