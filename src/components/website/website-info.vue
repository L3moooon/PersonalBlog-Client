<template>
  <div class="web-info">
    <div class="title">
      <svg
        class="icon"
        id="web-icon"
        aria-hidden="true">
        <use xlink:href="#icon-fengche"></use>
      </svg>
      <span>网站信息</span>
    </div>
    <div class="detail">
      <div class="column">
        <div class="info-title">运行时间：</div>
        <div class="content clock">{{ websiteData.run_time }}天</div>
      </div>
      <div class="column">
        <div class="info-title">今日访问：</div>
        <div class="content">{{ websiteData.today_page_view }}</div>
      </div>
      <div class="column">
        <div class="info-title">总计访问：</div>
        <div class="content">{{ websiteData.total_page_view }}</div>
      </div>
      <div class="column">
        <div class="info-title">文章数目：</div>
        <div class="content">{{ websiteData.article_num }}</div>
      </div>
      <div class="column">
        <div class="info-title">评论数目：</div>
        <div class="content">{{ websiteData.common_num }}</div>
      </div>
      <div class="column">
        <div class="info-title">最后活动：</div>
        <div class="content">{{ websiteData.last_time }}天前</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { getWebsiteInfo } from "@/api/website";
const websiteData = reactive({
  run_time: Number, //单位天
  last_time: 1,
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
  // console.log(websiteData);
  websiteData.run_time = transformRuntime();
});
const transformRuntime = () => {
  const currentDate = new Date();
  const currentTimestamp = currentDate.getTime() / 1000;
  const dateObj = new Date(websiteData.create_time);
  const createTimestamp = dateObj.getTime() / 1000;
  const timeDiff = currentTimestamp - createTimestamp;
  // console.log("cur", currentTimestamp, "creat", createTimestamp, timeDiff);

  return Math.floor(timeDiff / (60 * 60 * 24));
};
const transformActivateTime = () => {
  console.log(websiteData.last_activate);
};
</script>

<style lang="scss" scoped>
.web-info {
  width: 100%;
  // height: 4rem;
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  opacity: 0.9;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s;
  // margin: 1.5rem 0;
  margin-bottom: 1rem;

  .title {
    margin: 0.5rem;
    font-size: 1rem;
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
      // color: black;
      width: 1rem;
      height: 1rem;
      margin: 0 0.5rem;
    }
  }
  .detail {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    .column {
      // position: absolute;
      width: 28%;
      height: 3rem;
      margin: 0.4rem;
      text-align: center;
      border-radius: 10px;
      box-shadow: 2px 2px 5px #e6c481;
      transition: 0.3s;
      .info-title {
        width: 100%;
        line-height: 1.1rem;
        background-color: antiquewhite;
        border-radius: 10px 10px 0 0;
      }
      .content {
        background: linear-gradient(135deg, #4ca1af, #c4e0e5);
        line-height: 1.9rem;
        border-radius: 0 0 10px 10px;
      }
    }
    .column:hover {
      box-shadow: 2px 2px 5px #876a40;
      // font-size: 2em;
    }
  }
}
.web-info:hover {
  // height: calc();
}
</style>
