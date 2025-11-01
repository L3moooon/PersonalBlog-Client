<template>
	<div class="author">
		<div
			class="info"
			@mousemove="cardTransform"
			@mouseleave="resetCardTransform"
		>
			<img
				ref="imgRef"
				:src="userStore.portrait || anonymous"
				id="card-img"
				class="card__shine"
			/>
			<div class="name">{{ userStore.nickname }}</div>
			<!-- 早上好，下午好，晚上好 -->
			<div class="greeting">欢迎到访</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { throttle } from "lodash";
import { useUserStore } from "@/store/user";
import anonymous from "@/assets/icons/personal.png";
const userStore = useUserStore();

const imgRef = ref(null);
const cardTransform = (e) => {
	function changePos() {
		const degree = 0.4;
		// const img = document.getElementById("card-img");
		const box = imgRef.value.getBoundingClientRect();
		//鼠标x位置-box的位置-box中心点x的位置
		let calcY = e.clientX - box.x - box.width / 2;
		let calcX = e.clientY - box.y - box.height / 2;
		calcX = calcX > 0 ? Math.min(calcX, 75) : Math.max(calcX, -75);
		calcY = calcY > 0 ? Math.min(calcY, 75) : Math.max(calcY, -75);
		imgRef.value.style.transform =
			"rotateY(" +
			calcY * degree +
			"deg) " +
			"rotateX(" +
			calcX * -degree +
			"deg) ";
	}
	window.requestAnimationFrame(throttle(changePos, 100));
};
const resetCardTransform = () => {
	window.requestAnimationFrame(function () {
		// const img = document.getElementById("card-img");
		imgRef.value.style.transform = "rotateX(0) rotateY(0)";
	});
};
onMounted(() => {
	console.log(userStore.nickname);
});
</script>

<style lang="scss" scoped>
.author {
	width: 100%;
	height: 186px;
	background: linear-gradient(135deg, #83a4d4, #b6fbff);
	opacity: 0.9;
	border-radius: 10px;
	overflow: hidden;
	margin-bottom: 16px;
	.info {
		overflow: hidden;
	}
	img {
		display: block;
		width: 96px;
		height: 96px;
		border-radius: 10px;
		margin: 16px auto;
		transition: 0.5s;
		transform-style: preserve-3d;
	}
	.name {
		font-size: 16px;
		text-align: center;
		margin: 8px;
		overflow: hidden;
	}
	.greeting {
		font-size: 13px;
		font-weight: 500;
		text-align: center;
		margin: 5px;
	}
}
</style>
