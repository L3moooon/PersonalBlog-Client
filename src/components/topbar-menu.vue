<template>
  <div
    class="wrapper"
    ref="wrapperRef"
    @mouseenter="mouseenter"
    @mouseleave="mouseLeave">
    <div
      class="left"
      @click="backHome">
      <img src="@/assets/portrait.jpg" />
      <div class="name">宵时雨</div>
    </div>
    <div class="right">
      <div @click="mention">主题切换</div>
      <div @click="mention">搜索</div>
      <div @click="mention">文章</div>
      <div @click="mention">我的</div>
    </div>
  </div>
  <!-- <div
    v-show="!showWrapper"
    class="wrapper-placeholder"
    @mouseenter="mouseenter"></div> -->
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { throttle } from "lodash";
import { ElMessage } from "element-plus";
const router = useRouter();

const wrapperRef = ref(null);
const backHome = () => {
  router.push("/");
};
const showWrapper = ref(true);
function showOrHide(e) {
  // 下滑
  if (e.deltaY > 0) {
    showWrapper.value = false;
    wrapperRef.value?.classList.add("hide");
    wrapperRef.value?.classList.remove("show");
  }
  // 上滑
  else {
    // showWrapper.value = true;
    // wrapperRef.value?.classList.add("show");
    // wrapperRef.value?.classList.remove("hide");
    if (window.scrollY <= 80) {
      showWrapper.value = true;
      wrapperRef.value?.classList.add("show");
      wrapperRef.value?.classList.remove("hide");
    }
  }
}
const throttledShowOrHide = throttle(showOrHide, 100);
//光标进入时显示并添加遮罩层
const mouseenter = () => {
  showWrapper.value = true;
  wrapperRef.value?.classList.add("backdrop-filter");
  wrapperRef.value?.classList.add("show");
  wrapperRef.value?.classList.remove("hide");
};
//光标离开时关闭遮罩层，如果不在初屏位置就隐藏
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
onMounted(() => {
  window.addEventListener("wheel", throttledShowOrHide);
});
onUnmounted(() => {
  window.removeEventListener("wheel", throttledShowOrHide);
});
</script>

<style lang="scss" scoped>
.wrapper-placeholder {
  transition: 0.3s;
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  z-index: 999;
}
.backdrop-filter {
  transition: 0.3s;
  backdrop-filter: blur(5px);
  animation: fadeInBg 0.3s ease-out forwards;
}
.wrapper {
  width: 100%;
  height: 60px;
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
    height: 100%;
    margin-left: 20px;
    display: flex;
    align-items: center;
    animation: fadeIn 0.6s ease-out;

    img {
      width: 50px;
      border-radius: 5px;
    }
    .name {
      color: white;
      margin: 5px 12px 0 18px;
    }
  }
  .right {
    display: flex;
    width: 400px;
    color: white;
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
