<template>
	<div class="home-container">
		<div
			class="card"
			v-for="item in articleList"
			:key="item.id"
			@click="goRoute(item.id)">
			<el-skeleton
				:loading="item.isLoading"
				animated
				class="ske">
				<template #template>
					<!-- 关键修改：图片骨架加载状态 = 接口未加载完 或 图片未加载完 -->
					<el-skeleton-item
						variant="image"
						class="home-cover"
						:loading="item.isLoading || !item.imgLoaded" />
					<div class="content">
						<el-skeleton-item
							variant="text"
							class="title-skeleton" />
						<div class="tag">
							<el-skeleton-item
								v-for="value in 3"
								:key="value"
								variant="text"
								class="tag-skeleton" />
						</div>
						<el-skeleton-item
							variant="text"
							class="abstract-skeleton" />
						<el-skeleton-item
							variant="text"
							class="abstract-skeleton" />
						<div class="detail">
							<el-skeleton-item
								v-for="value in 3"
								:key="value"
								variant="text"
								class="detail-skeleton" />
						</div>
					</div>
				</template>

				<template #default>
					<div
						class="home-cover"
						:class="{ border: !item.cover_img }">
						<img
							:src="item.cover_img || defaultCover"
							alt=""
							@load="item.imgLoaded = true"
							@error="item.imgLoaded = true" />
					</div>
					<div class="content">
						<div class="title">{{ item.title }}</div>
						<div class="tag">
							<SvgComponent
								icon="sale"
								className="icon" />
							<div
								class="tag-item"
								v-for="(tag, index) in item.tag"
								:key="index">
								<div>{{ tag.name }}</div>
							</div>
						</div>
						<div class="abstract">{{ item.abstract || "暂无简介" }}</div>
						<div class="detail flex-between">
							<div class="time flex-center">
								<SvgComponent
									icon="time"
									className="detail-icon" />
								<span
									class="text"
									v-time:YYYY-MM-DD="item.publish_date"></span>
							</div>
							<div class="like flex-center">
								<SvgComponent
									icon="like"
									className="detail-icon " />
								<span class="text">{{ item.star }}</span>
							</div>
							<div class="view flex-center">
								<SvgComponent
									icon="view-count"
									className="detail-icon" />
								<span class="text"> {{ item.view }}</span>
							</div>
							<div class="comments flex-center">
								<SvgComponent
									icon="comment-count"
									className="detail-icon" />
								<span class="text"> {{ item.comment_count }}</span>
							</div>
						</div>
					</div>
					<!-- 置顶 -->
					<div
						class="top"
						v-if="item.top">
						置顶
					</div>
				</template>
			</el-skeleton>
		</div>
		<div
			v-show="hasMore && !isError"
			class="bottom-info"
			id="loader-footer">
			加载中...
		</div>
		<div
			v-if="isError"
			class="bottom-info"
			@click="getArticleList">
			<span style="cursor: pointer; color: #ff4d4f">加载失败，点击重试</span>
		</div>
		<div
			v-if="!hasMore && articleList.length > 0"
			class="bottom-info">
			已经到底啦!
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, watch } from "vue";
import { getHomeData } from "@/api/home";
import { useRouter } from "vue-router";
import { useTagStore } from "@/store/tag";
import defaultCover from "@/assets/img/default-cover.png";

const tagStore = useTagStore();
const router = useRouter();
const articleList = ref([]);

const observer = ref(null);
const loadingMore = ref(false); // 控制当前是否正在请求（防重复）
const hasMore = ref(true); // 控制是否还有更多数据
const isError = ref(false); // 控制请求是否出错

const loaderFooterDom = ref(null);

const pagination_info = reactive({
	pageNo: 1,
	pageSize: 5,
});

watch(
	() => tagStore.activatedTags.size,
	(newVal) => {
		// 重置分页和列表
		pagination_info.pageNo = 1;
		articleList.value = [];
		hasMore.value = true;
		getArticleList();
	}
);
const getArticleList = async () => {
	if (loadingMore.value || !hasMore.value) return;
	loadingMore.value = true;
	isError.value = false;
	// 插入占位数据：数量=每页条数，标记isLoading=true
	const placeholderList = Array.from(
		{ length: pagination_info.pageSize },
		() => ({
			id: `placeholder-${Date.now()}-${Math.random()}`, // 临时唯一ID，避免key冲突
			isLoading: true,
			imgLoaded: false, // 占位数据也添加图片加载状态，避免报错
		})
	);
	articleList.value = [...articleList.value, ...placeholderList];
	try {
		const { data, code, pagination } = await getHomeData({
			tags: [...tagStore.activatedTags],
			pageNo: pagination_info.pageNo,
			pageSize: pagination_info.pageSize,
		});
		if (code === 1) {
			// 1. 过滤掉占位数据（保留已加载的真实数据）
			const realExistingData = articleList.value.filter(
				(item) => !item.isLoading
			);
			// 2. 关键修改：给真实数据添加 imgLoaded 状态（初始未加载）
			const newRealData = data.map((item) => {
				return {
					...item,
					isLoading: false,
					imgLoaded: false, // 新增图片加载状态标记
				};
			});
			//console.log(newRealData);

			// 3. 更新列表：旧真实数据 + 新真实数据
			articleList.value = [...realExistingData, ...newRealData];
			//console.log(articleList.value.length, pagination.total);
			if (articleList.value.length >= pagination.total) {
				hasMore.value = false;
			} else {
				pagination_info.pageNo++; // 页码+1，为下一页请求准备
			}
			//console.log(pagination_info.pageNo);
		}
	} catch (error) {
		console.error("文章列表请求失败：", error);
		articleList.value = articleList.value.filter((item) => !item.isLoading);
		isError.value = true;
	} finally {
		loadingMore.value = false; // 重置请求状态
	}
};
const goRoute = (id) => {
	router.push({ path: "/article", query: { id } });
};

const initObserver = () => {
	console.log("初始化监听窗口滚动");
	if (!loaderFooterDom.value) return;
	observer.value = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				// 元素进入视口（含提前200px）时触发加载
				if (entry.isIntersecting && !isError.value) {
					getArticleList();
				}
			});
		},
		{ rootMargin: "0px 0px 200px 0px" } // 提前200px加载，优化体验
	);
	observer.value.observe(loaderFooterDom.value);
};
onMounted(() => {
	loaderFooterDom.value = document.getElementById("loader-footer");
	// getArticleList();
	initObserver();
});
onUnmounted(() => {
	loaderFooterDom.value = null;
	if (observer.value) {
		observer.value.disconnect(); // 停止所有观察
		observer.value = null; // 清空引用
	}
});
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
	.home-container {
		overflow: hidden; //解决高度塌陷
		height: 100%;
		.card {
			padding: 10px;
			margin: 16px 16px;
			height: 180px;
			background-color: white;
			border-radius: 10px;
			display: flex;
			box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
				-18px -18px 30px rgba(255, 255, 255, 1);
			transition: box-shadow 0.2s ease-out;
			cursor: pointer;
			position: relative;
			overflow: hidden;
			&:hover {
				box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
					0px 0px 0px rgba(255, 255, 255, 0.8),
					inset 18px 18px 30px rgba(0, 0, 0, 0.1),
					inset -18px -18px 30px rgba(255, 255, 255, 1);
				transition: box-shadow 0.2s ease-out;
				.home-cover img {
					scale: 1.2;
					transition: 0.3s;
				}
			}
			.ske {
				display: flex;
			}
			.home-cover {
				width: 40%;
				// width: 280px;
				height: 180px;
				border-radius: 10px;
				font-size: 30px;
				font-weight: 300;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				img {
					width: 100%;
					height: 100%;
					transition: 0.3s;
				}
			}
			.content {
				width: 60%;
				padding-left: 30px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title {
					height: 30px;
					padding: 24px 0 10px 0;
					font-size: 24px;
					font-weight: 500;
					color: #555555;
				}
				.tag {
					font-size: 14px;
					width: 100%;
					height: 30px;
					display: flex;
					align-items: center;
					gap: 10px;
					img {
						width: 15px;
						height: 15px;
					}
					.tag-item {
						background-color: antiquewhite;
						height: 20px;
						line-height: 20px;
						padding: 0 10px;
						border-radius: 5px;
						text-align: center;
					}
				}
				.abstract {
					height: 60px;
					font-size: 14px;
					font-weight: 200;
					color: #a0a0a0;
					display: flex;
					align-items: center;
					margin-right: 20px;
					text-align: justify;
				}
				.detail {
					height: 30px;
					width: 90%;
					font-size: 15px;
					font-weight: 200;
					color: #a0a0a0;
					.time,
					.like,
					.view,
					.comments {
						height: 100%;
						white-space: nowrap;
						overflow: hideen;
						text-overflow: ellipsis;
						.detail-icon {
							width: 18px;
							height: 18px;
							margin-right: 5px;
							color: #a0a0a0;
						}
						.text {
							line-height: 30px;
						}
						// .text {
						// 	display: flex;
						// 	align-items: center;
						// 	height: 18px;
						// 	vertical-align: middle;
						// }
					}
				}
				.title-skeleton {
					width: 70%;
					height: 20px;
					margin-top: 24px;
				}
				.tag-skeleton {
					width: 20%;
					height: 20px;
				}
				.abstract-skeleton {
					width: 100%;
					height: 20px;
				}
				.detail-skeleton {
					width: 30%;
					height: 20px;
				}
			}
			.top {
				width: 200px;
				height: 50px;
				background: linear-gradient(135deg, #c42c2c, #a02424);
				position: absolute;
				right: -65px;
				box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3),
					/* 外部阴影：模拟光线投射的阴影 */ inset 0 1px 2px
						rgba(255, 255, 255, 0.2); /* 内部阴影：模拟高光 */
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 18px;
				font-weight: 500; /* 加粗文字，增强存在感 */
				text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2); /* 文字阴影，让文字更立体 */
				// 增加细微的旋转偏差，避免过于规整
				transform: rotate(45deg) skew(-2deg, -2deg);
			}
		}
		.bottom-info {
			text-align: center;
			padding-bottom: 20px;
			color: #888;
			font-size: 14px;
		}
	}
}
@media (max-width: 768px) {
	.home-container {
		overflow: hidden;
		width: 100%;
		.card {
			padding: 10px;
			margin: 16px 16px;
			background-color: white;
			border-radius: 10px;
			position: relative;
			overflow: hidden;
			.home-cover {
				width: 100%;
				height: 180px;
				border-radius: 10px;
				font-size: 30px;
				font-weight: 300;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.border {
				border: 1px solid gray;
			}
			.content {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title {
					height: 30px;
					padding: 10px 0;
					font-size: 24px;
					font-weight: 500;
					color: #555555;
				}
				.tag {
					font-size: 14px;
					width: 100%;
					display: flex;
					align-items: center;
					gap: 10px;
					img {
						width: 15px;
						height: 15px;
					}
					.tag-item {
						background-color: antiquewhite;
						height: 20px;
						line-height: 20px;
						padding: 0 10px;
						border-radius: 5px;
						text-align: center;
					}
				}
				.abstract {
					height: 40px;
					font-size: 14px;
					font-weight: 200;
					color: #a0a0a0;
					display: flex;
					align-items: center;
				}
				.detail {
					height: 30px;
					display: flex;
					align-items: center;
					width: 90%;
					justify-content: space-between;
					font-size: 15px;
					font-weight: 200;
					color: #a0a0a0;
					.time,
					.like,
					.view,
					.comments {
						display: flex;
						height: 100%;
						align-items: center;
						white-space: nowrap;
						overflow: hideen;
						text-overflow: ellipsis;
						img {
							width: 15px;
							height: 15px;
							margin-right: 5px;
						}
					}
				}
			}
			.top {
				width: 200px;
				height: 50px;
				background: linear-gradient(135deg, #c42c2c, #a02424);
				position: absolute;
				right: -65px;
				box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3),
					/* 外部阴影：模拟光线投射的阴影 */ inset 0 1px 2px
						rgba(255, 255, 255, 0.2); /* 内部阴影：模拟高光 */
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 18px;
				font-weight: 500; /* 加粗文字，增强存在感 */
				text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2); /* 文字阴影，让文字更立体 */
				transform: rotate(45deg) skew(-2deg, -2deg);
			}
		}
		.bottom-info {
			text-align: center;
			padding: 20px 0;
			color: #888;
			font-size: 14px;
		}
	}
}
</style>
