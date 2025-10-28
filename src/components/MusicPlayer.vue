<template>
	<div
		class="music-container"
		ref="musicContainerRef"
		:class="showPlayer ? 'active' : 'unactive'"
		@mousedown="handleGrab"
		@mouseup="handleRelease"
	>
		<audio
			ref="audioRef"
			:src="audioUrl"
			@timeupdate="handleUpdateProcess"
		></audio>
		<div class="player">
			<div class="cover">
				<img
					class="cover-img"
					src="@/assets/img/music-cover.png"
					alt=""
				/>
			</div>
			<div class="music-detail">
				<div class="music-info">发如雪-周杰伦</div>
				<div class="controls">
					<el-button circle>
						<SvgComponent
							icon="back"
							width="1.2rem"
							height="1.2rem"
						/>
					</el-button>
					<el-button
						circle
						v-if="playStatus"
						@click="handlePaused"
					>
						<SvgComponent
							icon="pause"
							width="1.2rem"
							height="1.2rem"
						/>
					</el-button>
					<el-button
						circle
						v-else
						@click="handlePlay"
					>
						<SvgComponent
							icon="play"
							width="1.2rem"
							height="1.2rem"
						/>
					</el-button>
					<el-button circle>
						<SvgComponent
							icon="go"
							width="1.2rem"
							height="1.2rem"
						/>
					</el-button>
				</div>
				<div class="progress">
					<div
						class="progress-bar"
						id="progressBar"
					></div>
				</div>
			</div>
			<div
				class="disc"
				@click="handleShowPlayer"
			>
				<SvgComponent
					:className="['rotate', playStatus ? '' : 'stop']"
					icon="music"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import audioUrl from "@/assets/music/music.mp3";
import SvgComponent from "./SvgComponent.vue";

const musicContainerRef = ref(null);
const audioRef = ref(null);
const playStatus = ref(false); //播放状态
const showPlayer = ref(false);
const isDragging = ref(false);
const dragTime = ref(null);
const relativeX = ref(0);
const relativeY = ref(0);

const handlePlay = () => {
	audioRef.value.play();
	playStatus.value = true;
};
const handlePaused = () => {
	audioRef.value.pause();
	playStatus.value = false;
};
const handleUpdateProcess = () => {
	const percent = (audioRef.value.currentTime / audioRef.value.duration) * 100;
	progressBar.style.width = `${percent}%`;
};
const handleShowPlayer = () => {
	if (isDragging.value) return;
	showPlayer.value = !showPlayer.value;
};

const mouseMove = (e) => {
	isDragging.value = true; //移动视为拖拽
	const x = e.clientX - relativeX.value;
	const y = e.clientY - relativeY.value;
	musicContainerRef.value.style.left = `${showPlayer.value ? x : e.clientX}px`;
	musicContainerRef.value.style.top = `${y}px`;
};

//鼠标抓取
const handleGrab = (e) => {
	isDragging.value = false; //初始化
	dragTime.value = Date.now();
	musicContainerRef.value.style.cursor = "grabbing";
	musicContainerRef.value.style.transition = "none";

	// 获取鼠标在视口中的位置
	const mouseX = e.clientX;
	const mouseY = e.clientY;

	//获取容器元素的位置信息
	const container = e.currentTarget; // 当前容器元素
	const rect = container.getBoundingClientRect();

	// 计算相对位置
	relativeX.value = mouseX - rect.left;
	relativeY.value = mouseY - rect.top;
	//容器跟随鼠标移动
	window.addEventListener("mousemove", mouseMove);
};
const handleRelease = (e) => {
	// 可在此处判断是否为长按（如按下时间 > 300ms）
	const isLongPress = Date.now() - dragTime.value > 300;
	if (isLongPress) {
		isDragging.value = true; // 长按也视为非点击
	}
	musicContainerRef.value.style.cursor = "initial";
	musicContainerRef.value.style.transition = "0.5s";
	window.removeEventListener("mousemove", mouseMove);
	musicContainerRef.value.style.left = `0px`;
};
</script>

<style lang="scss" scoped>
$player-width: 340px;
$player-height: 80px;
.music-container {
	width: $player-width;
	height: $player-height;
	position: fixed;
	bottom: 100px;
	left: 0;
	color: #fff;
	border: 1px solid #4b5256;
	border-left: none;
	border-radius: 0 calc($player-height/2) calc($player-height/2) 0;
	transition: 0.5s;
	overflow: hidden;
	.player {
		height: 100%;
		background: transparent;
		backdrop-filter: blur(10px);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		.cover {
			width: 70px;
			height: 70px;
			margin: 5px 10px;
			border-radius: 5px;
			.cover-img {
				width: 100%;
				height: 100%;
				border-radius: 5px;
			}
		}
		.music-detail {
			flex: 1;
			.music-info {
				margin-top: 5px;
			}
			.controls {
				width: 160px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 8px 0;
				overflow: hidden;
			}
		}
	}
}
.active {
	transform: translateX(0);
}
.unactive {
	transform: translateX(calc($player-height/2) - $player-width);
}
.progress {
	width: 160px;
	height: 8px;
	background: #ddd;
	border-radius: 4px;
	overflow: hidden;
}
.progress-bar {
	height: 100%;
	background: #3498db;
	width: 0;
}
.volume {
	width: 80px;
	height: 8px;
	background: #ddd;
	border-radius: 4px;
	overflow: hidden;
}
.volume-bar {
	height: 100%;
	background: #3498db;
	width: 100%;
}
.disc {
	cursor: pointer;
	position: absolute;
	right: calc($player-height/2);
	top: 0;
	height: $player-height;
	width: $player-height;
	transform: translateX(50%);
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
.rotate {
	animation: rotate 4s linear infinite forwards;
}
.stop {
	animation-play-state: paused;
}
</style>
