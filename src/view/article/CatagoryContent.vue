<template>
	<div class="toc-content">
		<div class="toc-list">
			<div
				v-for="(item, index) in props.catagory"
				:key="index"
				class="toc-item"
				@click.stop
				@click.prevent="scrollToSection(item.id)"
			>
				<a
					:href="`#${item.id}`"
					:class="['toc-link', { 'toc-active': props.activeId === item.id }]"
				>
					<span class="toc-text">{{ item.text }}</span>
				</a>
				<!-- 子目录 -->
				<div
					v-if="item.children && item.children.length"
					class="toc-sub-list"
				>
					<CatagoryContent
						:catagory="item.children"
						:activeId="props.activeId"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import CatagoryContent from "./CatagoryContent.vue";
const props = defineProps(["catagory", "activeId"]);
// 滚动到指定章节
const scrollToSection = (id) => {
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}
};
</script>

<style lang="scss" scoped>
.toc-content {
	overflow-y: auto;
	flex-grow: 1;
}
.toc-item {
	.toc-link {
		display: block;
		padding: 6px 0;
		color: #222;
		text-decoration: none;
		transition: all 0.2s ease;
		.toc-text {
			margin-left: 4px;
		}

		&:hover {
			color: #fff;
			background-color: #1f5a5c;
			cursor: pointer;
			font-weight: bold;
			border-radius: 5px;
		}
	}
	.toc-active {
		cursor: pointer;
		font-weight: bold;
		border-radius: 5px;
		&::before {
			content: "";
			width: 2px;
			height: 100%;
			background-color: #222;
		}
	}
}

.toc-sub-list {
	margin-left: 24px;
	margin-bottom: 4px;
}

.toc-sub-item {
	margin-bottom: 4px;

	.toc-link {
		font-size: 15px;
		color: #64748b;
	}
}

// 动画效果
.toc-item {
	transition: all 0.3s ease;
}

.toc-active {
	animation: all 0.3s ease;
}

@keyframes highlight {
	from {
		background-color: rgba(59, 130, 246, 0.1);
	}
	to {
		background-color: transparent;
	}
}
</style>
