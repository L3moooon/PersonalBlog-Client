<template>
	<div class="banner-content">
		<div class="title">{{ article.title }}</div>
		<div class="abstract">{{ article.abstract || "暂无简介" }}</div>
		<div class="detail">
			<div class="top-half">
				<div class="info flex-center">
					<img
						class="info-img"
						src="@/assets/icons/time.png"
						alt=""
					/>
					发表于:
					<span v-time="article.publish_date"></span>
				</div>
				<div class="info flex-center">
					<img
						class="info-img"
						src="@/assets/icons/update.png"
						alt=""
					/>更新于:
					<span v-time="article.last_edit_date"></span>
				</div>
			</div>
			<div class="bottom-half flex-center">
				<div class="info flex-center">
					<img
						class="info-img"
						src="@/assets/icons/字数.png"
						alt=""
					/>字数统计:{{ article.contentLength }}
				</div>
				<div class="info flex-center">
					<img
						class="info-img"
						src="@/assets/icons/时间.png"
						alt=""
					/>阅读时长:{{ article.readingTime }}分钟
				</div>
			</div>
		</div>
	</div>
	<!-- 文章封面 -->
	<img
		class="banner-img flex-center"
		:src="article.cover_img"
		object-fit="contain"
	/>
</template>

<script setup>
const props = defineProps({
	article: {
		type: Object,
		required: true,
	},
});
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
	.banner-content {
		text-align: center;
		overflow: hidden;
		.title {
			margin: 40px 0;
			font-family: Alibaba PuHuiTi;
			font-weight: bold;
			font-size: 40px;
			span:first-child {
				color: #d13c31;
			}
		}
		.abstract {
			font-size: 20px;
			max-height: 100px;
		}
		.detail {
			font-family: Alibaba PuHuiTi;
			font-weight: 500;
			font-size: 18px;
			color: #474545;
			margin-top: 10px;
			flex-wrap: wrap;
			column-gap: 10px;
			.top-half,
			.bottom-half {
				display: flex;
				justify-content: center;
				column-gap: 20px;
			}
			.info {
				height: 30px;
				.info-img {
					width: 20px;
					margin-right: 5px;
				}
			}
		}
	}
	.banner-img {
		width: 90%;
		margin: 0 auto;
		margin-top: 10px;
		border-radius: 10px;
	}
}

@media (max-width: 768px) {
	.banner-content {
		text-align: center;
		.title {
			margin: 27px 0;
			font-family: Alibaba PuHuiTi;
			font-weight: bold;
			font-size: 44px;
			span:first-child {
				color: #d13c31;
			}
		}
		.abstract {
			font-size: 20px;
			max-height: 100px;
		}
		.detail {
			font-family: Alibaba PuHuiTi;
			font-weight: 500;
			font-size: 18px;
			color: #474545;
			margin-top: 10px;
			flex-wrap: wrap;
			column-gap: 10px;
			.top-half,
			.bottom-half {
				column-gap: 10px;
			}
			.info {
				height: 30px;
				.info-img {
					width: 20px;
					margin-right: 5px;
				}
			}
		}
	}
	.banner-img {
		width: 90%;
		margin: 0 auto;
		margin-top: 10px;
		border-radius: 10px;
	}
}
</style>
