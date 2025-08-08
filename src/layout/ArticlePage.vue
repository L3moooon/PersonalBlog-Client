<template>
  <div
    class="article-main"
    id="article-container">
    <TopbarMenu></TopbarMenu>
    <div class="banner">
      <img
        :src="article.cover_img"
        object-fit="contain" />
      <div class="mask"></div>
    </div>
    <div class="banner-content">
      <div class="box">
        <div class="title">{{ article.title }}</div>
        <div class="abstract">{{ article.abstract }}</div>
        <div class="detail">
          <div class="info">
            <img
              src="@/assets/icons/time.png"
              alt="" />
            发表于:{{ timeFormatter(article.publish_date) }}
          </div>
          |
          <div class="info">
            <img
              src="@/assets/icons/update.png"
              alt="" />更新于:{{ timeFormatter(article.last_edit_date) }}
          </div>
          |
          <div class="info">
            <img
              src="@/assets/icons/字数.png"
              alt="" />字数统计:{{ article.contentLength }}
          </div>
          |
          <div class="info">
            <img
              src="@/assets/icons/时间.png"
              alt="" />阅读时长:{{ article.readingTime }}分钟
          </div>
        </div>
      </div>
    </div>
    <div class="article-content">
      <div class="tool">工具栏</div>
      <div class="placeholder"></div>
      <div class="text-container">
        <div
          class="text"
          v-html="article.content"></div>
        <el-divider
          ><el-icon><star-filled /></el-icon
        ></el-divider>
        <div class="comments">
          <div class="pubCommnent">
            <el-input
              v-model="commentText"
              type="textarea"
              maxlength="400"
              show-word-limit
              rows="5"
              placeholder="下面我简单说两句..."></el-input>
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
              alt="" />
            <span>评论</span>
            <span>|</span>
            <span>当前共 {{ sum }} 条评论</span>
          </div>
          <div class="comment-content">
            <div
              class="comment-item"
              v-for="item in commentList"
              :key="item.id">
              <div class="comment-card">
                <div class="portrait">
                  <img
                    v-if="item.portrait"
                    :src="item.portrait"
                    alt="" />
                  <img
                    v-else
                    src="@/assets/icons/personal.png"
                    alt="" />
                </div>
                <div class="comment-info">
                  <div class="name">{{ item.reply_name }}</div>
                  <div class="content">{{ item.content }}</div>
                  <div class="detail">
                    <div class="time">
                      {{ timeFormatter2(item.comment_date) }}
                    </div>
                    <div
                      class="like"
                      @click="likeComment">
                      <div class="like-img"></div>
                      {{ item.like_count > 0 ? item.like_count : "" }}
                    </div>
                    <div
                      class="unlike"
                      @click="unlikeComment">
                      <div class="unlike-img"></div>
                      {{ item.like_count > 0 ? item.like_count : "" }}
                    </div>
                    <div
                      class="reply"
                      @click="reply(item.id, item.reply_name)">
                      回复
                    </div>
                  </div>
                  <ReplyCard
                    v-if="item.children.length"
                    :data="item.children"
                    :rootId="item.id"
                    :articleId="route.query.id"
                    :hideReplyName="true"></ReplyCard>
                  <div
                    v-if="showReplyBox == item.id"
                    class="reply-box">
                    <div class="reply-portrait">
                      <img
                        v-if="visitorInfo.portrait"
                        :src="visitorInfo.portrait"
                        alt="" />
                      <img
                        v-else
                        src="@/assets/icons/personal.png"
                        alt="" />
                    </div>
                    <div class="reply-text">
                      <el-input
                        class="reply-input"
                        :placeholder="replyTextPlaceholder"
                        v-model="replyText"
                        type="textarea"
                        maxlength="400"
                        rows="2"></el-input>
                      <div class="reply-pub">
                        <el-button
                          type="primary"
                          @click="pubComment(replyText)">
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
      </div>
      <el-affix
        :offset="0"
        position="top">
        <div class="catagory">目录</div>
      </el-affix>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { getArticle, getComments, comment, delComment } from "@/api/article";
import { StarFilled } from "@element-plus/icons-vue";
import TopbarMenu from "@/components/topbar-menu.vue";
import VisitorCard from "@/components/visitorCard.vue";
import ReplyCard from "@/components/replyCard.vue";
import { timeFormatter, timeFormatter2 } from "@/utils/timeFormatter";
import { ElMessage } from "element-plus";
import { useCommentStore } from "@/store/comment";
const commentStore = useCommentStore();
const route = useRoute();

const article = reactive({});
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

//获取文章内容
const getArticleContent = async () => {
  const { data, status } = await getArticle({ id: route.query.id });
  if (status == 1) {
    Object.assign(article, data);
    console.log(article);
    const res = computedInfo(article.content);
    console.log(res);
    article.contentLength = res[0];
    article.readingTime = res[1];
  }
};
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
//获取文章所有评论
const getArticleComments = async () => {
  const { data, status } = await getComments({ id: route.query.id });
  if (status == 1) {
    sum.value = data.length;
    const _data = processCommentList(data);
    commentList.value = _data;
  }
};

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
  console.log(id, name);
  showReplyBox.value = id;
  replyId.value = id;
  replyTextPlaceholder.value = "回复@" + name;
};

const likeComment = async (id) => {};
const unlikeComment = async (id) => {};

//计算文章内容长度等信息
function computedInfo(html, countSpaces = false) {
  // 1. 去除HTML标签
  console.log(html, typeof html);
  const plainText = html.replace(/<[^>]*>/g, "");
  // 2. 处理空白字符（可选：去除所有空格/保留空格）
  const text = countSpaces ? plainText : plainText.replace(/\s+/g, "");
  // 3. 统计长度（中文、英文、数字等均按1个字符计算）
  //按千字5分钟计算阅读时长
  const readingTime = ((text.length / 1000) * 5).toFixed(0);
  const _readingTime = readingTime <= 1 ? 1 : readingTime;
  return [text.length, _readingTime];
}

onMounted(() => {
  visitorInfo.value = JSON.parse(localStorage.getItem("visitor"));
  getArticleContent();
  getArticleComments();
});
</script>

<style lang="scss" scoped>
.article-main {
  position: relative;
  text-align: center;
  width: 100%;
  min-height: 100vh;
  background-image: url("@/assets/bamboo.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  // overflow: hidden;
  .banner {
    width: 100%;
    height: 500px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .mask {
      width: 100%;
      height: 100%;
      // position: fixed;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba($color: #222, $alpha: 0.5);
    }
  }
  .banner-content {
    position: absolute;
    left: 0;
    top: 111px;
    right: 0;
    display: flex;
    justify-content: center;
    .box {
      background: #ffffff;
      padding: 30px 120px;
      border-radius: 10px;
      opacity: 0.8;
    }
    .title {
      margin: 27px 0 50px 0;
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      font-size: 64px;
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
      color: #222222;
      margin-top: 50px;

      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      .info {
        display: flex;
        align-items: center;
        img {
          width: 20px;
          margin-right: 5px;
        }
      }
    }
  }
}
.article-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 40px 0;
  .text-container {
    min-height: 1000px;
    width: 1000px;
    border-radius: 10px;
    font-size: 20px;
    position: relative;
    background-color: #fff;
    padding: 10px;
    opacity: 0.8;
    text-align: left;
    .text {
      margin-bottom: 100px;
    }
    .comments {
      .pubCommnent {
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
  }

  .tool {
    width: 100px;
    height: 200px;
    background-color: #fff;
    border-radius: 10px;
    position: fixed;
    left: 250px;
    bottom: 40px;
    opacity: 0.8;
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
    opacity: 0.8;
  }
}
</style>
