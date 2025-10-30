<template>
	<div class="tag">
		<h3>标签云</h3>
	</div>
</template>

<script setup>
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
	h3 {
		font-size: 18px;
		font-weight: 600;
		color: #1e293b;
		padding-left: 8px;
	}
}
</style>
