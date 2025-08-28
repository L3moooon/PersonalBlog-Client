<template>
  <div
    class="article-main"
    id="article-container">
    <div class="banner-content">
      <div class="title">{{ article.title }}</div>
      <div class="abstract">{{ article.abstract || "暂无简介" }}</div>
      <div class="detail">
        <div class="info">
          <img
            src="@/assets/icons/time.png"
            alt="" />
          发表于:
          <span v-timeFormatter="article.publish_date"></span>
        </div>
        <div>|</div>
        <div class="info">
          <img
            src="@/assets/icons/update.png"
            alt="" />更新于:
          <span v-timeFormatter="article.last_edit_date"></span>
        </div>
        <div>|</div>
        <div class="info">
          <img
            src="@/assets/icons/字数.png"
            alt="" />字数统计:{{ article.contentLength }}
        </div>
        <div>|</div>
        <div class="info">
          <img
            src="@/assets/icons/时间.png"
            alt="" />阅读时长:{{ article.readingTime }}分钟
        </div>
      </div>
    </div>
    <!-- 文章封面 -->
    <img
      class="banner-img flex-center"
      :src="article.cover_img"
      object-fit="contain" />
    <!-- 正文 -->
    <el-divider></el-divider>
    <div
      class="article-content"
      id="article-content">
      <!-- <div class="tool">工具栏</div> -->
      <div class="text-container quill-content-wrapper">
        <div
          class="text quill-content"
          v-html="article.content"></div>
        <el-divider
          ><el-icon><star-filled /></el-icon
        ></el-divider>
      </div>
    </div>
    <!-- 评论 -->
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
        <span v-if="sum">当前共 {{ sum }} 条评论</span>
        <span v-else>暂无评论</span>
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
                <div
                  class="time"
                  v-timeFormatter="item.comment_date"></div>
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
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import {
  getArticle,
  getComments,
  comment,
  delComment,
  updateViewCount,
} from "@/api/article";
import { StarFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useCommentStore } from "@/store/comment";

import ReplyCard from "@/components/reply-card.vue";

import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

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

const timer = ref(null); //访问量计时器

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
    const res = computedInfo(article.content); //统计文章字数信息
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
  showReplyBox.value = id;
  replyId.value = id;
  replyTextPlaceholder.value = "回复@" + name;
};

const likeComment = async (id) => {};
const unlikeComment = async (id) => {};

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
onMounted(() => {
  visitorInfo.value = JSON.parse(localStorage.getItem("visitor"));
  getArticleContent();
  getArticleComments();
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

  // 遍历所有代码块，根据实际语言类型高亮
  document.querySelectorAll("pre code").forEach((block) => {
    // 从 class 中提取语言类型（Quill 会自动添加 language-xxx 类）
    const langClass = Array.from(block.classList).find((cls) =>
      cls.startsWith("language-")
    );
    const language = langClass
      ? langClass.replace("language-", "")
      : "plaintext";
    // 按指定语言高亮（确保与后台编辑时选择的语言匹配）
    hljs.highlightElement(block, { language });
  });
});
</script>

<style lang="scss" scoped>
.article-main {
  position: relative;
  width: 100%;
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
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Alibaba PuHuiTi;
      font-weight: 500;
      font-size: 18px;
      color: #474545;
      margin-top: 10px;
      flex-wrap: wrap;
      column-gap: 10px;
      .info {
        display: flex;
        align-items: center;
        height: 30px;
        img {
          width: 20px;
          margin-right: 5px;
        }
      }
    }
  }
  .banner-img {
    width: 90%;
    margin: 0 auto;
  }
}
.article-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 40px 40px 40px;
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
  padding: 10px 40px 40px 40px;
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
/* 确保Quill生成的对齐样式生效 */
:deep(.ql-align-center) {
  text-align: center !important;
}
:deep(.ql-align-right) {
  text-align: right !important;
}
:deep(.ql-align-justify) {
  text-align: justify !important;
}

/* 代码块样式增强（与编辑端保持视觉一致） */
:deep(pre) {
  margin: 1em 0;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  background-color: #282c34 !important; /* 与atom-one-dark主题匹配的背景色 */
}

:deep(.ql-syntax) {
  color: #abb2bf; /* 代码文本颜色 */
  // font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 6px 6px 6px 26px;
}

/* 修复图片样式（避免图片溢出容器） */
:deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
  border-radius: 4px;
}

/* 列表样式修复 */
:deep(ul),
:deep(ol) {
  padding-left: 2em;
  margin: 1em 0;
}

/* 标题样式调整 */
:deep(h1),
:deep(h2),
:deep(h3) {
  margin: 0.8em 0;
}
:deep(h1) {
  font-size: 24px;
  font-weight: 600;
}
:deep(h2) {
  font-size: 22px;
  font-weight: 600;
}
:deep(h3) {
  font-size: 20px;
  font-weight: 600;
}
:deep(p) {
  // text-indent: 2em;
  font-size: 18px;
  line-height: 22px;
  margin-bottom: 15px;
}

/* 引用样式 */
:deep(blockquote) {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  margin: 1em 0;
  color: #666;
}
</style>
