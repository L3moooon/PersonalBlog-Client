<template>
	<div
		class="article-main"
		id="article-container"
	>
		<Banner :article="article" />
		<el-divider></el-divider>
		<MainContent :article="article" />
		<Interact />
		<el-divider>
			<el-icon><star-filled /></el-icon>
		</el-divider>
		<CommentPanel />
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, reactive, watch } from "vue";
import { getArticle, updateViewCount } from "@/api/article";
import { StarFilled } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import Banner from "./Banner.vue";
import MainContent from "./MainContent.vue";
import Interact from "./Interact.vue";
import CommentPanel from "./CommentPanel.vue";
const route = useRoute();

const article = reactive({});
const timer = ref(null); //访问量计时器

//获取文章内容
const getArticleContent = async () => {
	//console.log(article);
	const { data, status } = await getArticle({ id: route.query.id });
	if (status == 1) {
		Object.assign(article, data);
		const res = computedInfo(article.content); //统计文章字数信息
		article.contentLength = res[0];
		article.readingTime = res[1];
	}
	//计算文章内容长度等信息
	function computedInfo(html, countSpaces = false) {
		// 1. 去除HTML标签
		const plainText = html.replace(/<[^>]*>/g, "");
		// 2. 处理空白字符（可选：去除所有空格/保留空格）
		const text = countSpaces ? plainText : plainText.replace(/\s+/g, "");
		// 3. 统计长度（中文、英文、数字等均按1个字符计算）
		const readingTime = ((text.length / 1000) * 3).toFixed(0); //按千字3分钟计算阅读时长
		const _readingTime = readingTime <= 1 ? 1 : readingTime;
		return [text.length, _readingTime];
	}
};

onMounted(() => {
	getArticleContent();
	//用户停留页面3s后计入访问量
	timer.value = setTimeout(async () => {
		//查找之前的浏览记录
		const viewHistory = JSON.parse(localStorage.getItem("viewHistory")) || {};
		const id = route.query.id;
		const now = Date.now();
		const TWELVE_HOURS = 12 * 60 * 60 * 1000; // 12小时的毫秒数
		if (!viewHistory[id] || now - viewHistory[id] > TWELVE_HOURS) {
			const { status } = await updateViewCount({ id });
			if (status == 1) {
				viewHistory[id] = now;
				localStorage.setItem("viewHistory", JSON.stringify(viewHistory));
			}
		}
	}, 3000);
});
onUnmounted(() => {
	Object.assign(article, {});
	if (timer.value) {
		clearTimeout(timer.value);
		timer.value = null; // 清空引用
	}
});
</script>
<style lang="scss" scoped>
@media (min-width: 768px) {
	.article-main {
		position: relative;
		width: 100%;
	}
}

@media (max-width: 768px) {
	.article-main {
		width: 100%;
		background-color: #f5f5f5;
		overflow: hidden;
	}
	.article-content {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 10px;
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
	.comments {
		overflow: hidden;
		padding: 10px;
		.pubComment {
			margin-bottom: 20px;
			.func {
				margin-top: 20px;
				display: flex;
				justify-content: flex-end;
			}
		}
		.comment-title {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 20px;
			img {
				width: 50px;
			}
		}
		.comment-content {
			.comment-card {
				width: 100%;
				display: flex;
				.portrait {
					flex-shrink: 0;
					width: 100px;
					display: flex;
					justify-content: center;
					img {
						width: 60px;
						height: 60px;
						margin: 0;
					}
				}
				.comment-info {
					width: 100%;
					padding-right: 10px;
					.name {
						font-size: 17px;
						color: #515151;
					}
					.content {
						margin-top: 10px;
						font-size: 18px;
						line-height: 25px;
					}
					.detail {
						margin-top: 10px;
						display: flex;
						align-items: center;
						color: #707070;
						font-size: 16px;
						gap: 20px;
						.like {
							cursor: pointer;
							// .like-img {
							// 	width: 20px;
							// 	height: 20px;
							// 	margin-right: 10px;
							// 	background-image: url("@/assets/icons/like.png");
							// 	background-repeat: no-repeat;
							// 	background-size: cover;
							// 	&:hover {
							// 		background-image: url("@/assets/icons/like-hover.png");
							// 	}
							// }
						}
						// .unlike {
						// 	cursor: pointer;
						// 	.unlike-img {
						// 		width: 20px;
						// 		height: 20px;
						// 		margin-right: 10px;
						// 		background-image: url("@/assets/icons/unlike.png");
						// 		background-repeat: no-repeat;
						// 		background-size: cover;
						// 		&:hover {
						// 			background-image: url("@/assets/icons/unlike-hover.png");
						// 		}
						// 	}
						// }
						.reply {
							cursor: pointer;
							&:hover {
								color: #00aeec;
							}
						}
					}
					.reply-box {
						display: flex;
						width: 100%;
						margin-top: 15px;
						.reply-portrait {
							img {
								width: 60px;
								height: 60px;
								margin-right: 15px;
							}
						}
						.reply-text {
							width: 100%;
							.reply-input {
								margin-bottom: 10px;
							}
							.reply-pub {
								display: flex;
								justify-content: flex-end;
							}
						}
					}
				}
			}
		}
	}
	.el-divider {
		// overflow: hidden;
		z-index: 10;
		margin: 15px 0;
	}
	:deep(.text-container code::-webkit-scrollbar) {
		width: 5px !important;
		height: 5px !important;
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
}
</style>
