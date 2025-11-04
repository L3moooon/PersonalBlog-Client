<template>
	<div class="text-box">
		<span
			id="type-list"
			class="text"
		></span>
		<span
			class="line"
			:class="{ blink: blinkLine }"
			>|</span
		>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const text = ref([
	"若待上林花似锦，出门俱是开花人",
	"去年今日此门中，人面桃花相映红",
	"梧桐叶上三更雨，叶叶声声是别离",
	"浮生岂得长年少，莫惜醉来开口笑",
	"若似月轮终皎洁，不辞冰雪为卿热",
	"夜鹭望流目不瞬，大鱼兴左视不觉",
]);
const containerElement = ref(null);
const blinkLine = ref(false);

const isUnmounted = ref(false); // 标记组件是否已卸载
const timeoutTimer = ref(null);
const intervalTimer = ref(null);

async function typePoem(poemArr) {
	let i = 0;
	while (i < poemArr.length && !isUnmounted.value) {
		//光标动画间隔0.75s，waitBegin的间隔时间最好是750ms的整数倍
		await waitBegin(2250);
		await typeText(poemArr[i], 350);
		await waitBegin(2250);
		await delText(poemArr[i], 90);
		//无限循环
		i++;
		if (i == poemArr.length) i = 0;
	}
	function waitBegin(delay) {
		//console.log("等待开始");
		blinkLine.value = true;
		return new Promise((resolve) => {
			timeoutTimer.value = setTimeout(resolve, delay);
		});
	}
	function typeText(poem, delay) {
		//console.log("开始type");
		let pointer = 0;
		blinkLine.value = false;
		return new Promise((resolve) => {
			intervalTimer.value = setInterval(() => {
				if (isUnmounted.value) {
					// 组件卸载时终止循环
					clearInterval(intervalTimer.value);
					return;
				}
				containerElement.value.textContent += poem[pointer++];
			}, delay);
			timeoutTimer.value = setTimeout(() => {
				clearInterval(intervalTimer.value);
				resolve();
			}, delay * poem.length);
		});
	}
	function delText(poem, delay) {
		//console.log("开始del");
		blinkLine.value = false;
		let pointer = poem.length - 1;
		return new Promise((resolve, reject) => {
			intervalTimer.value = setInterval(() => {
				if (isUnmounted.value) {
					// 组件卸载时终止循环
					clearInterval(intervalTimer.value);
					return;
				}
				containerElement.value.textContent = poem.slice(0, pointer);
				pointer--;
			}, delay);
			timeoutTimer.value = setTimeout(() => {
				clearInterval(intervalTimer.value);
				resolve();
			}, delay * poem.length);
		});
	}
}
onMounted(() => {
	containerElement.value = document.getElementById("type-list");
	typePoem(text.value);
});
onUnmounted(() => {
	isUnmounted.value = true; // 标记组件已卸载
	containerElement.value = null;
	clearInterval(intervalTimer.value); // 清理 setInterval
	clearTimeout(timeoutTimer.value); // 清理 setTimeout
});
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
	.text-box {
		user-select: none;
		margin: 16px 0;
		height: 32px;
		line-height: 32px;
		.text {
			display: inline-block;
			height: 32px;
			white-space: nowrap;
			font-size: 32px;
			overflow: hidden;
		}
		@keyframes blink {
			0% {
				opacity: 1;
			}
			50% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		.line {
			font-family: Arial, Helvetica, sans-serif;
			display: inline-block;
			line-height: 32px;
			font-size: 35px;
			transform: scaleX(0.6);
			vertical-align: top;
		}
		.blink {
			animation: blink 0.75s ease-in-out 0s infinite;
		}
	}
}

@media (max-width: 768px) {
	.text-box {
		margin: 16px 0;
		height: 32px;
		line-height: 32px;
		.text {
			display: inline-block;
			height: 32px;
			white-space: nowrap;
			font-size: 24px;
			overflow: hidden;
		}
		@keyframes blink {
			0% {
				opacity: 1;
			}
			50% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		.line {
			font-family: Arial, Helvetica, sans-serif;
			display: inline-block;
			line-height: 32px;
			font-size: 26px;
			transform: scaleX(0.6);
			vertical-align: top;
		}
		.blink {
			animation: blink 0.75s ease-in-out 0s infinite;
		}
	}
}
</style>
