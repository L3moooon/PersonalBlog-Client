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
	width: {
		type: [String, Number],
		default: "1rem",
	},
	heigth: {
		type: [String, Number],
		default: "1rem",
	},
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
	width: 100%;
	height: 100%;
	color: currentColor;
	fill: currentColor;
	overflow: hidden;
}
</style>
