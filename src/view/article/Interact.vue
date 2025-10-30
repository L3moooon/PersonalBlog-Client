<template>
	<div class="interact flex-evenly">
		<SvgComponent
			v-if="likeStatus"
			@click="likeArticle"
			icon="like"
			className="icon"
		/>
		<SvgComponent
			v-else
			@click="likeArticle"
			icon="like-fill"
			className="icon like-fill"
		/>
		<SvgComponent
			@click="bonus"
			icon="money"
			className="icon"
		/>
		<SvgComponent
			@click="shareArticle"
			icon="share"
			className="icon"
		/>
		<el-dialog
			v-model="rewardDialogVisible"
			class="reward-dialog"
			:lock-scroll="false"
		>
			<template #title>打赏作者</template>
			<div class="reward-pic flex-evenly">
				<img
					src="@/assets/img/reward-zfb.png"
					alt="打赏二维码"
					class="reward qrcode-zfb"
				/>
				<img
					src="@/assets/img/reward-vx.png"
					alt=""
					class="reward qrcode-vx"
				/>
			</div>
			<div class="reward-text">感谢您的支持！</div>
		</el-dialog>
	</div>
</template>

<script setup>
import SvgComponent from "@/components/SvgComponent.vue";
import { ElMessage } from "element-plus";
import { ref } from "vue";

const likeStatus = ref(false);
const rewardDialogVisible = ref(false);

//点赞文章
const likeArticle = () => {
	likeStatus.value = !likeStatus.value;
	if (!likeStatus.value) {
		ElMessage.success("感谢您的点赞！");
	}
};
//打赏作者
const bonus = () => {
	rewardDialogVisible.value = true;
};
//分享文章
const shareArticle = () => {
	//复制网站地址到粘贴板
	navigator.clipboard.writeText(window.location.href).then(
		() => {
			ElMessage.success("文章链接已复制到剪贴板");
		},
		() => {
			ElMessage.error("复制失败，请手动复制链接");
		}
	);
};
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
}
.interact {
	width: 80%;
	margin: 0 auto;
	.icon {
		width: 60px;
		height: 6%;
		cursor: pointer;
		&:hover {
			opacity: 0.7;
			animation: shake 0.8s linear infinite;
		}
	}
	.like-fill {
		fill: #55bddf;
	}
	.reward-pic {
		display: flex;
		.reward {
			width: 300px;
		}
		.qrcode-zfb {
			height: 324px;
		}
	}
	.reward-text {
		text-align: center;
		margin: 20px;
		font-size: 16px;
	}
}
@keyframes shake {
	0% {
		transform: rotate(0);
	}
	25% {
		transform: rotate(-30deg);
	}
	50% {
		transform: rotate(0deg);
	}
	75% {
		transform: rotate(30deg);
	}
	100% {
		transform: rotate(0deg);
	}
}
</style>
