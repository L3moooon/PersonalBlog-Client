<template>
  <div class="container">
    <div class="top">
      <TopbarMenu></TopbarMenu>
      <div class="main">
        <div class="name">{{ themeStore.themeData.welcome }}</div>
        <TypeText :text="themeStore.saying"></TypeText>
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
        <VisitorCard></VisitorCard>
        <el-affix :offset="20">
          <WebsiteInfo></WebsiteInfo>
          <RecommandArticle></RecommandArticle>
        </el-affix>
        <!-- TODO 访客信息 -->
        <!-- TODO 标签 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { routes } from "@/router/route";
import { onMounted } from "vue";
import { getThemeInfo } from "@/api/website.js";
import { sendUserInfo } from "@/api/user";
import { useThemeStore } from "@/store/theme";
import MenuList from "@/components/menu-list.vue";
import VisitorCard from "@/components/visitor-card.vue";
import WebsiteInfo from "@/components/website-info.vue";
import RecommandArticle from "@/components/recommand-article.vue";
import TypeText from "@/components/type-text.vue";
import TopbarMenu from "@/components/topbar-menu.vue";
import "@/styles/poem-font.css";
//请求用户信息并放到pinia仓库
const themeStore = useThemeStore();
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
  return btoa(features.join("|")).substring(0, 20);
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
//获取网站主题
const getTheme = async () => {
  const { data, status } = await getThemeInfo();
  if (status == 1) {
    themeStore.setThemeData(data);
  }
  themeStore.$patch((state) => {
    state.nickname = data.nickname;
    state.portrait = data.portrait;
    state.saying = data.saying;
    state.url = data.url;
  });
};
const turnDownPage = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth", // 平滑滚动效果
  });
};
onMounted(async () => {
  sendInfo();
  getTheme();
});
</script>

<style lang="scss" scoped>
.container {
  // background-image: url("../assets/night.png");
  // background-image: url("../assets/CrayonShinchan.png");
  background-image: url("../assets/bamboo.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  .top {
    .main {
      width: 100%;
      height: 100vh;
      padding: 0 auto;
      // position: absolute;
      // left: 50%;
      // top: 50%;
      // transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;

      // width: 500px;
      // height: 200px;
      // backdrop-filter: blur(3px);
      border-radius: 30px;
      font-family: SiJiYuNi;
      .name {
        font-size: 4rem;
        font-weight: 500;
      }
      .button {
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
        cursor: pointer;
        border: 1px solid #e0be6e;
        box-shadow: 10px;
      }
    }
  }
}

.down {
  // height: 200px;
  min-height: 100vh;
  display: flex;
  width: 70%;
  margin: 4rem auto;
  margin-bottom: 20px;
  justify-content: space-between;
  // align-items: center;
  flex-grow: 1 2 1;
  .left-container {
    width: 15%;
  }
  .el-menu {
    border-radius: 10px;
    --el-font-family: Avenir, Helvetica, Arial, sans-serif;
    --el-menu-item-font-size: 0.75rem;
  }
  .content-middle {
    width: 65%;
    background-color: #efeeee;
    border-radius: 10px;
    margin: 0 1rem;
  }
  .right-container {
    width: 20%;
  }
}
</style>
