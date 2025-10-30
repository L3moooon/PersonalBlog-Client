<template>
	<!-- 评论 -->
	<div
		class="comments"
		id="comment-panel"
	>
		<div class="pubComment">
			<el-input
				v-model="commentText"
				type="textarea"
				maxlength="400"
				show-word-limit
				rows="5"
				placeholder="下面我简单说两句..."
			></el-input>
			<div class="func">
				<el-button
					type="primary"
					@click="pubComment(commentText)"
					>发表评论</el-button
				>
			</div>
		</div>
		<div class="comment-title">
			<img
				src="@/assets/icons/评论.png"
				alt=""
			/>
			<span>评论</span>
			<span>|</span>
			<span v-if="sum">当前共 {{ sum }} 条评论</span>
			<span v-else>暂无评论</span>
		</div>
		<div class="comment-content">
			<div
				class="comment-item"
				v-for="item in commentList"
				:key="item.id"
			>
				<div class="comment-card">
					<div class="portrait">
						<img
							v-if="item.portrait"
							:src="item.portrait"
							alt=""
						/>
						<img
							v-else
							src="@/assets/icons/personal.png"
							alt=""
						/>
					</div>
					<div class="comment-info">
						<div class="name">{{ item.reply_name }}</div>
						<div class="content">{{ item.content }}</div>
						<div class="detail">
							<div
								class="time"
								v-timeFormatter="item.comment_date"
							></div>
							<div
								class="like"
								@click="likeComment"
							>
								<div class="like-img"></div>
								{{ item.like_count > 0 ? item.like_count : "" }}
							</div>
							<div
								class="unlike"
								@click="unlikeComment"
							>
								<div class="unlike-img"></div>
								{{ item.like_count > 0 ? item.like_count : "" }}
							</div>
							<div
								class="reply"
								@click="reply(item.id, item.reply_name)"
							>
								回复
							</div>
						</div>
						<CommentContent
							v-if="item.children.length"
							:data="item.children"
							:rootId="item.id"
							:articleId="route.query.id"
							:hideReplyName="true"
						></CommentContent>
						<div
							v-if="showReplyBox == item.id"
							class="reply-box"
						>
							<div class="reply-portrait">
								<img
									v-if="visitorInfo.portrait"
									:src="visitorInfo.portrait"
									alt=""
								/>
								<img
									v-else
									src="@/assets/icons/personal.png"
									alt=""
								/>
							</div>
							<div class="reply-text">
								<el-input
									class="reply-input"
									:placeholder="replyTextPlaceholder"
									v-model="replyText"
									type="textarea"
									maxlength="400"
									rows="2"
								></el-input>
								<div class="reply-pub">
									<el-button
										type="primary"
										@click="pubComment(replyText)"
									>
										发布
									</el-button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<el-divider> </el-divider>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import CommentContent from "@/view/article/CommentContent.vue";
import { useCommentStore } from "@/store/comment";

import { getComments, comment, delComment } from "@/api/article";

const commentStore = useCommentStore();
const route = useRoute();

const commentList = ref([]);
const sum = ref(); //评论总数
const visitorInfo = ref(null);

const commentText = ref(""); //回复文章内容
const replyText = ref(""); //回复评论内容
const replyId = ref(null); //回复父节点id
const showReplyBox = ref(-1);
const replyTextPlaceholder = ref("");
//回复楼中楼
watch(
	() => commentStore.parent_id,
	(val) => {
		if (val) {
			replyId.value = commentStore.parent_id;
			showReplyBox.value = commentStore.rootId;
			replyTextPlaceholder.value = "回复@" + commentStore.name;
		}
	}
);

//处理评论列表方便展示
function processCommentList(comments) {
	const commentMap = {};
	const rootComments = [];
	// 先将所有评论按id映射
	comments.forEach((comment) => {
		commentMap[comment.id] = { ...comment, children: [] };
	});
	// 构建层级关系
	comments.forEach((comment) => {
		if (comment.parent_id === null) {
			rootComments.push(commentMap[comment.id]);
		} else {
			if (commentMap[comment.parent_id]) {
				commentMap[comment.parent_id].children.push(commentMap[comment.id]);
			}
		}
	});
	return rootComments;
}
//发表评论
const pubComment = async (content) => {
	//BUG info有可能为空
	const { status } = await comment({
		article_id: Number(route.query.id),
		user_id: visitorInfo.value.id,
		content,
		parent_id: replyId.value,
	});
	if (status == 1) {
		ElMessage.success("发布成功");
		commentText.value = "";
		replyText.value = "";
		commentStore.replyFloor = false;
		getArticleComments();
	}
};
//回复楼主
const reply = (id, name) => {
	showReplyBox.value = id;
	replyId.value = id;
	replyTextPlaceholder.value = "回复@" + name;
};
//获取文章所有评论
const getArticleComments = async () => {
	const { data, status } = await getComments({ id: route.query.id });
	if (status == 1) {
		sum.value = data.length;
		const _data = processCommentList(data);
		commentList.value = _data;
	}
};
onMounted(() => {
	visitorInfo.value = JSON.parse(localStorage.getItem("visitor"));
	getArticleComments();
});
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
}
.comments {
	padding: 10px 40px 40px 40px;
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
						.like-img {
							width: 20px;
							height: 20px;
							margin-right: 10px;
							background-image: url("@/assets/icons/like.png");
							background-repeat: no-repeat;
							background-size: cover;
							&:hover {
								background-image: url("@/assets/icons/like-hover.png");
							}
						}
					}
					.unlike {
						cursor: pointer;
						.unlike-img {
							width: 20px;
							height: 20px;
							margin-right: 10px;
							background-image: url("@/assets/icons/unlike.png");
							background-repeat: no-repeat;
							background-size: cover;
							&:hover {
								background-image: url("@/assets/icons/unlike-hover.png");
							}
						}
					}
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
</style>
