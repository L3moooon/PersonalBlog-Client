<template>
	<div class="home-container">
		<div
			class="card"
			v-for="item in articleList"
			:key="item.id"
			@click="goRoute(item.id)"
		>
			<el-skeleton
				:loading="item.isLoading"
				animated
				class="ske"
			>
				<template #template>
					<!-- 关键修改：图片骨架加载状态 = 接口未加载完 或 图片未加载完 -->
					<el-skeleton-item
						variant="image"
						class="home-cover"
						:loading="item.isLoading || !item.imgLoaded"
					/>
					<div class="content">
						<el-skeleton-item
							variant="text"
							class="title-skeleton"
						/>
						<div class="tag">
							<el-skeleton-item
								v-for="value in 3"
								variant="text "
								class="tag-skeleton"
							/>
						</div>
						<el-skeleton-item
							variant="text"
							class="abstract-skeleton"
						/>
						<el-skeleton-item
							variant="text"
							class="abstract-skeleton"
						/>
						<div class="detail">
							<el-skeleton-item
								v-for="value in 3"
								variant="text"
								class="detail-skeleton"
							/>
						</div>
					</div>
				</template>

				<template #default>
					<!-- 图片区域：新增加载状态绑定 -->
					<div
						class="home-cover"
						:class="{ border: !item.cover_img }"
					>
						<img
							v-if="item.cover_img"
							:src="item.cover_img"
							alt=""
							@load="item.imgLoaded = true"
							@error="item.imgLoaded = true"
						/>
						<!-- 无图片时显示占位文本 -->
						<div
							v-else
							class="img-placeholder"
						>
							暂无封面
						</div>
					</div>
					<div class="content">
						<div class="title">{{ item.title }}</div>
						<div class="tag">
							<img
								src="@/assets/icons/tag.png"
								alt=""
							/>
							<div
								class="tag-item"
								v-for="(tag, index) in item.tag"
								:key="index"
							>
								{{ tag.name }}
							</div>
						</div>
						<div class="abstract">{{ item.abstract || "暂无简介" }}</div>
						<div class="detail">
							<div class="time">
								<img
									src="@/assets/icons/time.png"
									alt=""
								/>
								<span v-timeFormatter:YYYY-MM-DD="item.last_edit_date"></span>
							</div>
							<div class="like">
								<img
									src="@/assets/icons/like.png"
									alt=""
								/>
								{{ item.star }}
							</div>
							<div class="view">
								<img
									src="@/assets/icons/view.png"
									alt=""
								/>
								{{ item.view }}
							</div>
							<div class="comments">
								<img
									src="@/assets/icons/评论.png"
									alt=""
								/>
								{{ item.comment_count }}
							</div>
						</div>
					</div>
					<!-- 置顶 -->
					<div
						class="top"
						v-if="item.top"
					>
						置顶
					</div>
				</template>
			</el-skeleton>
		</div>
		<div
			v-show="hasMore"
			class="bottom-info"
			id="loader-footer"
		>
			加载中...
		</div>
		<div
			v-if="!hasMore && articleList.length > 0"
			class="bottom-info"
		>
			已经到底啦!
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { getHomeData } from "@/api/home";
import { useRouter } from "vue-router";

const router = useRouter();
const articleList = ref([]);

const observer = ref(null);
const loadingMore = ref(false); // 控制当前是否正在请求（防重复）
const hasMore = ref(true); // 控制是否还有更多数据

const pagination_info = reactive({
	pageNo: 1,
	pageSize: 5,
});

const getArticleList = async () => {
	console.log("获取文章列表");
	if (loadingMore.value || !hasMore.value) return;
	loadingMore.value = true;
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
		console.log(pagination_info.pageNo, pagination_info.pageSize);
		const { data, code, pagination } = await getHomeData({
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
			console.log(newRealData);

			// 3. 更新列表：旧真实数据 + 新真实数据
			articleList.value = [...realExistingData, ...newRealData];
			console.log(articleList.value.length, pagination.total);
			if (articleList.value.length >= pagination.total) {
				hasMore.value = false;
			} else {
				pagination_info.pageNo++; // 页码+1，为下一页请求准备
			}
			console.log(pagination_info.pageNo);
		}
	} catch (error) {
		console.error("文章列表请求失败：", error);
		articleList.value = articleList.value.filter((item) => !item.isLoading);
	} finally {
		loadingMore.value = false; // 重置请求状态
	}
};
const initObserver = () => {
	const loaderEl = document.getElementById("loader-footer");
	console.log(loaderEl);
	if (!loaderEl) return;
	observer.value = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				// 元素进入视口（含提前200px）时触发加载
				if (entry.isIntersecting) {
					getArticleList();
				}
			});
		},
		{ rootMargin: "0px 0px 200px 0px" } // 提前200px加载，优化体验
	);
	observer.value.observe(loaderEl);
};
onMounted(() => {
	getArticleList();
	initObserver();
});

const goRoute = (id) => {
	router.push({ path: "/article", query: { id } });
};
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
				}
				.detail {
					height: 30px;
					display: flex;
					align-items: center;
					width: 90%;
					justify-content: space-between;
					// gap: 60px;
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
