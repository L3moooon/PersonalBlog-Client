<template>
	<div
		v-for="item in props.data"
		:key="item.id">
		<div class="comment-card">
			<div class="portrait">
				<img
					v-if="item.reply_portrait"
					:src="item.reply_portrait"
					alt="" />
				<img
					v-else
					src="@/assets/icons/personal.png"
					alt="" />
			</div>
			<div class="info">
				<div class="content">
					<span class="name"> {{ item.reply_name }} </span>
					<template v-if="!props.hideReplyName">
						回复
						<span
							@click="returnPos"
							class="name parent_name">
							{{ item.parent_name }}
						</span>
					</template>

					<span> :{{ item.content }}</span>
				</div>
				<div class="detail">
					<div
						class="time"
						v-time="item.comment_date"></div>
					<div class="like">
						<SvgComponent icon="like" />
						{{ item.like_count > 0 ? item.like_count : "" }}
					</div>
					<div
						class="reply"
						@click="reply(item.id, item.reply_name)">
						回复
					</div>
				</div>
			</div>
		</div>
		<CommentContent
			v-if="item.children && item.children.length"
			:data="item.children"
			:rootId="props.rootId"
			:articleId="props.articleId"></CommentContent>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import CommentContent from "@/view/article/CommentContent.vue";
import { useCommentStore } from "@/store/comment";

const commentStore = useCommentStore();
const props = defineProps({
	data: {},
	articleId: {},
	hideReplyName: {
		default: false,
	},
	rootId: {},
});
//回复评论
const reply = (id, name) => {
	//console.log(props.rootId, id, name);
	commentStore.setData(props.rootId, id, name);
};

const visitorInfo = ref(null);
onMounted(() => {
	visitorInfo.value = JSON.parse(localStorage.getItem("visitor"));
});
</script>

<style lang="scss" scoped>
.comment-card {
	width: 100%;
	display: flex;
	margin: 12px 0;
	.portrait {
		flex-shrink: 0;
		width: 50px;
		display: flex;
		justify-content: center;
		img {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			margin-top: 10px;
		}
	}
	.info {
		padding-right: 10px;
		.name {
			font-size: 17px;
			color: #515151;
		}
		.content {
			margin-top: 10px;
			font-size: 18px;
			.parent_name {
				cursor: pointer;
				color: #008ac5;
				&:hover {
					color: #00aeec;
				}
			}
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
			}
			.like:hover .like-svg-container svg path {
				fill: #ff4d4f;
			}
			.unlike {
				cursor: pointer;
			}
			.reply {
				cursor: pointer;
				&:hover {
					color: #00aeec;
				}
			}
		}
	}
}
</style>
