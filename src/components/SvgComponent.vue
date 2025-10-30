<template>
	<svg
		class="svg-icon"
		:width="width"
		:heigth="heigth"
		:class="className"
		aria-hidden="true"
	>
		<use :xlink:href="iconName" />
	</svg>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
	icon: {
		type: String,
		required: true,
	},
	className: {
		type: String,
		default: "",
	},
});
const iconName = computed(() => `#icon-${props.icon}`);
</script>

<style scoped>
.svg-icon {
	width: 20px;
	height: 20px;
	color: currentColor;
	fill: currentColor;
	overflow: hidden;
}
</style>
