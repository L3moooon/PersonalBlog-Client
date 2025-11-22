<template>
	<div class="toc-container">
		<!-- 目录标题 -->
		<div class="toc-header">
			<h3 class="toc-title">
				<i
					class="fa fa-list-ul"
					aria-hidden="true"
				></i>
				目录
			</h3>
			<div class="progress-info">
				<span class="progress-percentage">{{ progress }}</span>
			</div>
		</div>
		<!-- 进度条和百分比 -->
		<div class="progress-section">
			<div class="progress-bar">
				<div
					class="progress-fill"
					:style="{ width: progress + '%' }"
				></div>
			</div>
		</div>
		<!-- 目录内容 -->
		<CatagoryContent
			v-if="tocItems.length"
			:catagory="tocItems"
			:activeId="activeId"
		/>
		<div
			v-else
			class="noCatagory flex-center"
		>
			<SvgComponent
				icon="leaf-maple"
				className="icon"
			/>
			暂无目录
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import CatagoryContent from "./CatagoryContent.vue";
import { throttle } from "lodash";
// 接收内容区域的选择器作为参数
const observer = ref(null);

const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
// 目录项数据
const tocItems = ref([]);
// 当前激活的目录项ID
const activeId = ref("");
// 浏览进度百分比
const progress = ref(0);
// 内容区域元素
// 所有标题元素及其位置信息
let headingPositions = [];

const contentElement = ref(null); //文章内容dom
const containerElement = ref(null); //文章容器(包含标题)
// 生成目录和收集标题位置
const generateToc = () => {
	// 获取内容区域
	if (!contentElement.value) return;
	// 清空现有目录
	tocItems.value = [];
	headingPositions = [];

	// 收集所有标题元素
	let headingElements = [];
	//console.log(headingTags);
	headingTags.forEach((tag) => {
		const elements = contentElement.value.querySelectorAll(tag);
		headingElements.push(...Array.from(elements));
	});
	// 按在文档中的位置排序
	headingElements.sort((a, b) => a.offsetTop - b.offsetTop);
	// 为没有ID的标题生成ID
	headingElements.forEach((el) => {
		if (!el.id) {
			// 使用标题文本生成ID
			const text = el.textContent
				.trim()
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");
			el.id =
				text ||
				`heading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		}
		// 记录标题位置信息
		headingPositions.push({
			id: el.id,
			offsetTop: el.offsetTop,
			// 下一个标题的位置作为当前标题的结束位置
			nextOffsetTop: Infinity,
		});
	});
	// 设置每个标题的结束位置（下一个标题的起始位置）
	headingPositions.forEach((item, index) => {
		if (index < headingPositions.length - 1) {
			item.nextOffsetTop = headingPositions[index + 1].offsetTop;
		} else {
			// 最后一个标题的结束位置是内容区域底部
			item.nextOffsetTop = contentElement.value.scrollHeight;
		}
	});
	// 构建目录结构
	const stack = [];
	headingElements.forEach((el) => {
		const level = parseInt(el.tagName.replace("H", ""));
		const item = {
			id: el.id,
			text: el.textContent.trim(),
			level,
			children: [],
		};
		// 找到合适的父节点
		while (stack.length > 0 && stack[stack.length - 1].level >= level) {
			stack.pop();
		}
		if (stack.length === 0) {
			tocItems.value.push(item);
		} else {
			stack[stack.length - 1].children.push(item);
		}
		stack.push(item);
	});
};

// 处理滚动事件，更新当前激活的目录项和进度
const handleScroll = () => {
	// 计算滚动进度
	const scrollPosition = window.scrollY;
	const total =
		containerElement.value.getBoundingClientRect().height - window.innerHeight;
	const percentage = Math.min(Math.max(0, (scrollPosition / total) * 100), 100);
	progress.value = Math.round(percentage);
	// 确定当前激活的标题
	//console.log(headingPositions);
	// 查找当前滚动位置所在的标题区间
	for (let i = 0; i < headingPositions.length; i++) {
		const current = headingPositions[i];
		// 检查滚动位置是否在当前标题的区间内（当前标题开始位置 <= 滚动位置 < 下一个标题开始位置）
		if (
			scrollPosition >= current.offsetTop &&
			scrollPosition < current.nextOffsetTop
		) {
			activeId.value = current.id;
			break;
		}
	}
};
const throttleHandleScroll = throttle(handleScroll, 50);
// 组件挂载时初始化
onMounted(() => {
	contentElement.value = document.getElementById("article-content");
	containerElement.value = document.getElementById("article-container");
	// 创建 MutationObserver 实例，监听内容容器的子元素变化
	// 当容器内 DOM 变化（v-html 内容渲染进来）时，重新生成目录
	observer.value = new MutationObserver(() => {
		generateToc();
	});
	// 配置监听选项，监听子元素的新增、删除等变化，以及所有后代元素变化
	observer.value.observe(contentElement.value, {
		childList: true,
		subtree: true,
	});
	window.addEventListener("scroll", throttleHandleScroll);
	// 组件卸载时清理
});
onUnmounted(() => {
	contentElement.value = null;
	containerElement.value = null;
	if (observer.value) {
		observer.value.disconnect();
		observer.value = null;
	}
	window.removeEventListener("scroll", throttleHandleScroll);
});
</script>

<style lang="scss" scoped>
.toc-container {
	min-height: 80px;
	background: linear-gradient(135deg, #83a4d4, #b6fbff);
	opacity: 0.9;
	border-radius: 10px;
	overflow: hidden;
	padding: 10px 5px;
}

// 进度条样式
.progress-section {
	margin-bottom: 10px;

	.progress-bar {
		height: 3px;
		background-color: #e2e8f0;
		border-radius: 3px;
		overflow: hidden;

		.progress-fill {
			height: 100%;
			background-color: #3b82f6;
			border-radius: 3px;
			transition: width 0.3s ease;
		}
	}
}
.noCatagory {
	width: 100%;
	// height: 30px;
	margin: 40px 0 30px 0;
	.icon {
		margin-right: 10px;
	}
}
.toc-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;

	.toc-title {
		font-size: 20px;
		font-weight: 600;
		color: #1e293b;
		margin: 0;
		display: flex;
		align-items: center;

		i {
			margin-right: 8px;
			color: #3b82f6;
		}
	}
	.progress-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 5px;
		position: relative;
		.progress-text {
			font-size: 14px;
			color: #64748b;
		}

		.progress-percentage {
			position: absolute;
			right: 10px;
			font-size: 20px;
			font-weight: 500;
			color: #858282;
		}
	}
}
</style>
