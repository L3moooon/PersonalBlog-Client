<template>
	<div class="hot">
		<div class="title flex-vertical-center">
			<SvgComponent
				icon="fire"
				class="icon"
			/>
			<div class="title-text">热门文章</div>
		</div>
		<div class="content">
			<div
				class="item"
				v-for="(item, index) in pagination.articles"
				:key="item.id"
				@click="handleJump(item.id)"
			>
				<div
					class="number flex-center"
					:class="{
						top1: index == 0,
						top2: index == 1,
						top3: index == 2,
					}"
				>
					{{ index + 1 }}
				</div>
				<div class="right flex-center">
					{{ item.title }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { getRecommendArticle } from "@/api/home";

const router = useRouter();
const pagination = reactive({
	page: 1, // 当前页码，初始为1
	limit: 5, // 每页条数，与后端约定（固定5条）
	articles: [], // 已加载的所有文章列表
	hasMore: true, // 是否还有更多数据（控制“加载更多”按钮显示）
	isLoading: false, // 加载中状态（防止重复点击）
});
const getList = async () => {
	const { data, status, hasMore } = await getRecommendArticle({
		page: pagination.page,
		limit: pagination.limit,
	});
	if (status == 1) {
		pagination.articles = data;
		pagination.page++;
		pagination.hasMore = hasMore;
	}
};
const handleJump = (id) => {
	router.push({ path: "/article", query: { id } });
};
const handleRefresh = () => {
	getList();
};
onMounted(() => {
	getList();
});
</script>

<style lang="scss" scoped>
.hot {
	background: linear-gradient(135deg, #83a4d4, #b6fbff);
	opacity: 0.9;
	border-radius: 10px;
	overflow: hidden;
	.title {
		margin: 10px 0 10px 5px;
		.icon {
			width: 20px;
			height: 20px;
			margin: 0 5px;
			animation: fireBurn 3s linear infinite;
		}
		.title-text {
			margin-left: 5px;
			font-weight: bold;
		}

		.title-func {
			cursor: pointer;
			margin-right: 10px;
		}
	}
	.content {
		.item {
			cursor: pointer;
			border-radius: 5px;
			height: 30px;
			margin-bottom: 10px;
			margin-left: 5px;
			padding: 0 5px;
			display: flex;
			align-items: center;
			border: 1px solid transparent;
			transition: 0.3s;
			&:hover {
				transform: translateY(-10%) translateX(10%) scale(1.1);
				transition: 0.3s;
			}
			.number {
				width: 20px;
				height: 20px;
				border-radius: 5px;
				background-color: #b1c8cc;
			}
			.top1 {
				background-color: #f85b1b;
			}
			.top2 {
				background-color: #f97f4e;
			}
			.top3 {
				background-color: #fba480;
			}
			.right {
				margin-left: 10px;
			}
		}
	}
}
@keyframes fireBurn {
	0% {
		transform: rotate(0) scaleY(1);
	}
	25% {
		transform: rotate(-10deg) scaleY(1.1);
	}
	50% {
		transform: rotate(0) scaleY(1.2);
	}
	75% {
		transform: rotate(10deg) scaleY(1.1);
	}
	100% {
		transform: rotate(0) scaleY(1);
	}
}
</style>
