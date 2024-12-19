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
import TopbarIndex from "./topbar/top-index.vue";
import LeftIndex from "./left/left-index.vue";
import ContentIndex from "./content/content-index.vue";
import RightIndex from "./right/right-index.vue";

import { onMounted } from "vue";
import { getUserInfo } from "@/api/user/index.js";
import { useUserStore } from "@/store/user";
//请求用户信息并放到pinia仓库
const useStore = useUserStore();
onMounted(async () => {
  const { data } = await getUserInfo();
  // console.log(data);
  useStore.$patch((state) => {
    state.nickname = data.nickname;
    state.portrait = data.portrait;
    state.saying = data.saying;
    state.url = data.url;
  });
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
