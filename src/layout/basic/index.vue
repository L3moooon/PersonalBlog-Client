<template>
  <div
    class="container"
    id="home-img-container">
    <div class="top">
      <TopbarMenu></TopbarMenu>
      <div
        class="main"
        v-if="showTop && route.path != '/article'">
        <div class="name">欢迎来访</div>
        <TypeText v-if="isFocus"></TypeText>
        <button
          @click="turnDownPage"
          class="button">
          主页
        </button>
      </div>
    </div>

    <div class="down">
      <!-- 左 -->
      <div class="left-container">
        <el-affix :offset="20">
          <el-menu popper-class="menu">
            <MenuList
              :menuList="routes"
              router="true"></MenuList>
          </el-menu>
        </el-affix>
      </div>
      <!-- 中 -->
      <div class="content-middle">
        <router-view></router-view>
      </div>
      <!-- 右-->
      <div class="right-container">
        <!-- 文章独有 -->
        <template v-if="route.path == '/article'">
          <el-affix :offset="20">
            <ArticleCatagory
              contentSelector="article-content"></ArticleCatagory>
            <TagCloud></TagCloud>
          </el-affix>
        </template>
        <!-- 其他页通用 -->
        <template v-else>
          <VisitorCard></VisitorCard>
          <WebsiteInfo></WebsiteInfo>
          <el-affix :offset="20">
            <RecommandArticle></RecommandArticle>
          </el-affix>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { routes } from "@/router/route";
import { useRoute } from "vue-router";
import { sendUserInfo } from "@/api/user";

import MenuList from "@/components/menu-list.vue";
import VisitorCard from "@/layout/basic/visitor-card.vue";
import WebsiteInfo from "@/layout/basic/website-info.vue";
import ArticleCatagory from "@/view/articel/article-catagory.vue";
import RecommandArticle from "@/layout/basic/recommand-article.vue";
import TagCloud from "@/components/tag-cloud.vue";
import TypeText from "@/layout/basic/type-text.vue";
import TopbarMenu from "@/layout/basic/topbar-menu.vue";
import { throttle } from "lodash";

const screenWidth = ref(window.innerWidth);
const isMobile = ref(screenWidth.value < 768);

const route = useRoute();
const showTop = ref(true); // 控制top区域是否显示
const isFocus = ref(true); //控制打字机仅在前台时显示

// 生成简单的浏览器指纹
function generateFingerprint() {
  // 收集浏览器特征
  const features = [
    navigator.userAgent,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    navigator.language,
    navigator.cookieEnabled ? "cookies" : "no-cookies",
  ];
  // 简单哈希处理生成唯一ID
  return btoa(features.join("|")).substring(20, 30);
}
//FIXME 如果清除缓存并且在后端时长没有到1h，数据就会为空
const sendInfo = async () => {
  const STORAGE_KEY = "last_visit_stat";
  const NOW = new Date().getTime();
  const ONEHOUR = 60 * 60 * 1000;

  // 获取检查上次发送时间
  const lastStats = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '{"time": 0}'
  );

  // 如果超过1小时或从未发送过，则发送统计请求
  if (NOW - lastStats.time > ONEHOUR) {
    const { data, status } = await sendUserInfo({
      identify: generateFingerprint(),
      agent: navigator.userAgent,
    });
    if (status == 1) {
      // 记录本次发送时间
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ time: NOW }));
      localStorage.setItem("visitor", JSON.stringify(data));
    }
  }
};

const turnDownPage = () => {
  window.scrollTo({
    top: window.innerHeight + 1,
    behavior: "smooth", // 平滑滚动效果
  });
};
// 滚动到内容区时销毁上半屏
const handleScroll = () => {
  // 获取top区域的高度
  const topElement = document.querySelector(".top");
  if (!topElement) return; // 避免元素未加载时的错误
  const topHeight = topElement.offsetHeight;
  // 滚动距离超过top高度时，销毁top
  // showTop.value = window.scrollY < topHeight;
  if (window.scrollY > topHeight) {
    setTimeout(() => {
      showTop.value = false;
    }, 100);
  }
};
const throttledHandleScroll = throttle(handleScroll, 200);
// 处理页面可见性变化
const handleVisibilityChange = () => {
  isFocus.value = !document.hidden;
};

const handleResize = () => {
  screenWidth.value = window.innerWidth;
  isMobile.value = screenWidth.value < 768;
};
onMounted(() => {
  sendInfo();
  handleScroll(); //先判断一次
  window.addEventListener("scroll", throttledHandleScroll);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("scroll", throttledHandleScroll);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
.container {
  background-image: url("@/assets/bamboo.jpg");
  // background-image: url("@/assets/night.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  .top {
    .main {
      width: 100%;
      height: 100vh;
      padding: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      border-radius: 30px;
      font-family: SiJiYuNi;
      .name {
        font-size: 4rem;
        font-weight: 500;
      }
      .button {
        cursor: pointer;
        font-family: SiJiYuNi;
        font-size: 20px;
        color: white;
        display: block;
        height: 40px;
        width: 100px;
        background-color: #e9c669;
        border-radius: 5px;
        font-weight: 500;
        margin: 1rem auto;
        border: 1px solid #e0be6e;
        box-shadow: 10px;
      }
    }
  }
}

.down {
  display: flex;
  padding-top: 80px;
  min-height: 100vh;
  width: 80%;
  gap: 20px;
  max-width: 1280px;
  min-width: 1080px;
  margin: 0 auto;
  .left-container {
    width: 200px;
  }
  .el-menu {
    border-radius: 10px;
    overflow: hidden;
    --el-font-family: Avenir, Helvetica, Arial, sans-serif;
    --el-menu-item-font-size: 14px;
  }
  .content-middle {
    flex: 1;
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .right-container {
    width: 250px;
  }
}
</style>
