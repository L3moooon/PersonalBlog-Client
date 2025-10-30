<template>
	<div class="tool-container">
		<SvgComponent
			@click="scrollToTop"
			icon="top"
			className="icon"
		/>
		<SvgComponent
			@click="scrollToComments"
			icon="scroll-comment"
			className="icon"
		/>
		<SvgComponent
			@click="routerBack"
			icon="route-back"
			className="icon"
		/>
	</div>
</template>

<script setup>
import SvgComponent from "./SvgComponent.vue";
import { useRouter } from "vue-router";
const router = useRouter();
//滚动到顶部
const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};
//滚动到评论区
const scrollToComments = () => {
	const commentPanel = document.getElementById("comment-panel");
	if (commentPanel) {
		commentPanel.scrollIntoView({ behavior: "smooth" });
	}
};
//返回上一页
const routerBack = () => {
	router.back();
};
</script>

<style lang="scss" scoped>
.tool-container {
	position: fixed;
	border-radius: 10px 0 0 10px;
	bottom: 50px;
	right: 0;
	width: 80px;
	height: 200px;
	background: linear-gradient(135deg, #83a4d4, #b6fbff);
	opacity: 0.9;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	.icon {
		width: 40px;
		height: 40px;
		color: #222;
		transition: 0.3s;
		&:hover {
			cursor: pointer;
			transform: scale(1.1);
			transition: 0.3s;
		}
	}
}
</style>
