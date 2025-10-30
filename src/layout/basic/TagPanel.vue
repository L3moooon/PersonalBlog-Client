<template>
	<div class="tag">
		<div class="flex-vertical-center">
			<SvgComponent
				icon="tag"
				className="icon"
			/>
			<div class="title">标签云</div>
		</div>
	</div>
</template>

<script setup>
import SvgComponent from "@/components/SvgComponent.vue";
import { ref, onMounted } from "vue";
</script>

<style lang="scss" scoped>
.tag {
	min-height: 80px;
	background: linear-gradient(135deg, #83a4d4, #b6fbff);
	opacity: 0.9;
	border-radius: 10px;
	overflow: hidden;
	padding: 10px 5px;
	margin-top: 20px;
	.icon {
		width: 20px;
		height: 20px;
		animation: flip 3s linear infinite;
	}
	.title {
		font-weight: bold;
		padding-left: 8px;
	}
}
@keyframes flip {
	from {
		transform: rotateY(0deg);
	}
	to {
		transform: rotateY(360deg);
	}
}
</style>
