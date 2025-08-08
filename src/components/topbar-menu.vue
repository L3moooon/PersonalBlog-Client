<template>
  <div
    v-show="showWrapper"
    class="wrapper"
    ref="wrapperRef"
    @mouseenter="mouseenter"
    @mouseleave="mouseLeave">
    <div
      class="left"
      @click="backHome">
      <img :src="useTheme.portrait" />
      <span>{{ useTheme.nickname }}</span>
    </div>
    <div class="right">
      <div @click="mention">主题切换</div>
      <div @click="mention">搜索</div>
      <div @click="mention">文章</div>
      <div @click="mention">我的</div>
    </div>
  </div>
  <div
    v-show="!showWrapper"
    class="wrapper-placeholder"
    @mouseenter="mouseenter"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "@/store/theme";
import { throttle } from "@/utils/throttle";
import { ElMessage } from "element-plus";
const useTheme = useThemeStore();
const router = useRouter();

const wrapperRef = ref(null);
const backHome = () => {
  router.push("/");
};
const showWrapper = ref(true);
window.addEventListener(
  "wheel",
  throttle((e) => {
    if (e.deltaY > 0) {
      showWrapper.value = false;
    } else {
      showWrapper.value = true;
    }
  }, 100)
);
const mouseenter = () => {
  showWrapper.value = true;
  wrapperRef.value.classList.add("backdrop-filter");
};
const mouseLeave = () => {
  console.log(window.scrollY);
  if (window.scrollY > 80) {
    showWrapper.value = false;
  }
  wrapperRef.value.classList.remove("backdrop-filter");
};
const mention = () => {
  ElMessage.info("敬请期待");
};
</script>

<style lang="scss" scoped>
.wrapper-placeholder {
  transition: 0.3s;

  width: 100%;
  height: 80px;
  position: fixed;
  top: 0;
  z-index: 999;
}
.backdrop-filter {
  transition: 0.3s;
  backdrop-filter: blur(5px); /* 模糊半径，值越大越模糊 */
}
.wrapper {
  width: 100%;
  height: 80px;
  position: fixed;
  top: 0;
  z-index: 999;
  transition: 0.3s;

  display: flex;
  justify-content: space-between;
  align-items: center;

  // overflow: hidden;
  // height: 0;
  // padding: 0;
  // transition: all 0.5s ease-out;
  .left {
    cursor: pointer;
    margin: 1rem;
    display: flex;
    align-items: center;
    img {
      width: 50px;
      border-radius: 5px;
    }
    span {
      color: white;
      font-size: 30px;
      font-weight: 500;
      margin: 0 0.8rem;
    }
  }
  .right {
    display: flex;
    width: 400px;
    color: white;
    font-size: 20px;
    font-weight: 500;
    justify-content: space-evenly;
    div {
      cursor: pointer;
    }
  }
}
</style>
