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
        <div class="comments">
          <div class="comment-title">
            <img
              src="@/assets/icons/评论.png"
              alt="" />
            <span>评论</span>
            <span>|</span>
            <span>当前共5条留言</span>
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
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { getArticle, getComments } from "@/api/article";
import TopbarMenu from "@/components/topbar/topbar-menu.vue";
import VisitorCard from "@/components/visitorCard.vue";

import { timeFormatter } from "@/utils/timeFormatter";

const route = useRoute();

const article = reactive({});
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
const getArticleComments = async () => {
  const { data, status } = await getComments({ id: route.query.id });
  if (status == 1) {
    // Object.assign(article, data[0]);
    // console.log(article);
    // const res = computedInfo(article.content);
    // console.log(res);
    // article.contentLength = res[0];
    // article.readingTime = res[1];
  }
};
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
  console.log(route.query);
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
      .comment-title {
        display: flex;
        align-items: center;
        gap: 10px;
        img {
          width: 50px;
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
