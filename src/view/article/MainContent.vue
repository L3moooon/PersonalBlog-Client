<template>
	<!-- 正文 -->
	<div
		class="article-content"
		id="article-content"
	>
		<div class="text-container">
			<Editor
				v-model="article.content"
				:defaultConfig="editorConfig"
				mode="default"
			/>
		</div>
	</div>
</template>

<script setup>
import { Editor } from "@wangeditor/editor-for-vue";

const props = defineProps({
	article: {
		type: Object,
		required: true,
	},
});

const editorConfig = {
	readOnly: true,
};
</script>

<style lang="scss" scoped>
@import "~@wangeditor/editor/dist/css/style.css";
@media (min-width: 768px) {
}
.article-content {
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 10px 40px 0px 40px;
	box-sizing: border-box;
	.text-container {
		width: 100%;
		border-radius: 10px;
		font-size: 20px;
		position: relative;
		text-align: left;
		.text {
			margin-bottom: 100px;
			img {
				max-height: 300px;
			}
		}
	}
	.tool {
		width: 100px;
		height: 200px;
		background-color: #fff;
		border-radius: 10px;
		position: fixed;
		left: 250px;
		bottom: 40px;
		opacity: 0.9;
	}
	.placeholder {
		width: 350px;
	}
	.catagory {
		width: 250px;
		margin-right: 100px;
		min-height: 200px;
		border-radius: 10px;
		background-color: #fff;
		opacity: 0.9;
	}
}
:deep(.text-container code::-webkit-scrollbar) {
	width: 10px !important;
	height: 10px !important;
}
:deep(.text-container code::-webkit-scrollbar-thumb) {
	border-radius: 5px !important;
	box-shadow: 0 0 2px #fff !important;
	background-color: #808080 !important;
}
:deep(.text-container code::-webkit-scrollbar-track) {
	border-radius: 0;
	box-shadow: inset 0 0 2px #fff;
}
</style>
