<template>
  <div
    class="wrapper"
    ref="wrapperRef"
    @mouseenter="mouseenter"
    @mouseleave="mouseLeave">
    <div
      class="left"
      @click="backHome">
      <img :src="useTheme.portrait" />
      <!-- <span>{{ useTheme.nickname }}</span> -->
      <div class="name">个人博客</div>
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
      wrapperRef.value?.classList.add("hide");
      wrapperRef.value?.classList.remove("show");
    } else {
      showWrapper.value = true;
      wrapperRef.value?.classList.add("show");
      wrapperRef.value?.classList.remove("hide");
    }
  }, 100)
);
const mouseenter = () => {
  showWrapper.value = true;
  wrapperRef.value?.classList.add("backdrop-filter");
  wrapperRef.value?.classList.add("show");
  wrapperRef.value?.classList.remove("hide");
};
const mouseLeave = () => {
  console.log(window.scrollY);
  if (window.scrollY > 80) {
    showWrapper.value = false;
    // 触发隐藏动画
    wrapperRef.value?.classList.add("hide");
    wrapperRef.value?.classList.remove("show");
  }
  wrapperRef.value?.classList.remove("backdrop-filter");
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
  animation: fadeInBg 0.3s ease-out forwards;
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

  // 新增：默认加载动画
  animation: slideDown 0.5s ease-out forwards;
  background-color: rgba(0, 0, 0, 0);
  &.show {
    animation: slideDown 0.5s ease-out forwards;
  }
  &.hide {
    animation: slideUp 0.5s ease-out forwards;
  }
  .left {
    cursor: pointer;
    margin: 1rem;
    display: flex;
    align-items: center;
    animation: fadeIn 0.6s ease-out;

    img {
      width: 80px;
      border-radius: 5px;
    }
    .name {
      color: white;
      font-size: 20px;
      font-weight: 400;
      margin: 35px 12px 0 18px;
    }
  }
  .right {
    display: flex;
    width: 400px;
    color: white;
    font-size: 20px;
    font-weight: 500;
    justify-content: space-evenly;
    animation: fadeIn 0.8s ease-out;

    div {
      cursor: pointer;
    }
  }
}

// 新增关键帧动画
@keyframes slideDown {
  from {
    transform: translateY(-100%); // 从顶部隐藏位置滑入
    opacity: 0;
  }
  to {
    transform: translateY(0); // 滑到正常位置
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(0); // 从正常位置滑出
    opacity: 1;
  }
  to {
    transform: translateY(-100%); // 滑到顶部隐藏
    opacity: 0;
  }
}

@keyframes fadeInBg {
  from {
    background-color: rgba(0, 0, 0, 0); // 完全透明背景
  }
  to {
    background-color: rgba(0, 0, 0, 0.3); // 半透明背景
  }
}

// 补充子元素淡入动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
