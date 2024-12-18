<template>
  <div class="web-info">
    <div class="title">
      <svg class="icon" id="web-icon" aria-hidden="true">
        <use xlink:href="#icon-website"></use>
      </svg>
      <span>网站信息</span>
    </div>
    <div class="detail">
      <div>运行时间：{{ websiteData.create_time }}</div>
      <div>今日访问：{{ websiteData.today_page_view }}</div>
      <div>总计访问：{{ websiteData.total_page_view }}</div>
      <div>文章数目：{{ websiteData.article_num }}</div>
      <div>评论数目：{{ websiteData.common_num }}</div>
      <div>最后活动：{{ websiteData.last_activate }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { getWebsiteInfo } from "@/api/website";
const websiteData = reactive({
  create_time: String,
  today_page_view: Number,
  total_page_view: Number,
  article_num: Number,
  common_num: Number,
  last_activate: String,
});
onMounted(async () => {
  const { data } = await getWebsiteInfo();
  if (data && data[0]) {
    Object.assign(websiteData, data[0]);
  }
});
</script>

<style lang="scss" scoped>
.web-info {
  width: 100%;
  height: 20rem;
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  opacity: 0.9;
  border-radius: 10px;
  overflow: hidden;
  margin: 1.5rem 0;

  .title {
    margin: 0.5rem;
    font-size: 1.8rem;
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .icon {
      animation: rotate 2s linear infinite;
      color: black;
      width: 1.5rem;
      height: 1.5rem;
      margin: 0 0.5rem;
    }
  }
  .detail {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    div {
      width: 45%;
      height: 4.9rem;
      background-color: #83a4d4;
      margin: 0.4rem;
      border-radius: 10px;
    }
    div:hover {
      // position: relative;
      // width: 5.76rem;
      // height: 7.2rem;
    }
  }
}
</style>
