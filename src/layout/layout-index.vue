<template>
  <div class="container">
    <div class="top">
      <TopbarIndex></TopbarIndex>
    </div>
    <div class="down">
      <LeftIndex></LeftIndex>
      <ContentIndex></ContentIndex>
      <RightIndex></RightIndex>
    </div>
  </div>
</template>

<script setup>
import TopbarIndex from "./top/top-index.vue";
import LeftIndex from "./left/left-index.vue";
import ContentIndex from "./content/content-index.vue";
import RightIndex from "./right/right-index.vue";

import { onMounted } from "vue";
import { getThemeInfo } from "@/api/website.js";
import { sendUserInfo } from "@/api/user";
import { useThemeStore } from "@/store/theme";
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
}

.down {
  // height: 200px;
  display: flex;
  width: 70%;
  margin: 4rem auto;
  justify-content: space-between;
  // align-items: center;
  flex-grow: 1 2 1;
}
</style>
