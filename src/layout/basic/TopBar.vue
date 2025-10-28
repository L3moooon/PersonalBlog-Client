<template>
  <div
    class="wrapper flex-between"
    id="topbar-menu"
    ref="wrapperRef"
    @mouseenter="mouseenter"
    @mouseleave="mouseLeave"
  >
    <div
      class="left flex-center"
      @click="backHome"
    >
      <img
        class="top-icon"
        src="@/assets/portrait.jpg"
      />
      <div class="name">宵时雨</div>
    </div>
    <div class="right flex-center">
      <template v-if="themeStore.isDesktop()">
        <!-- <div @click="mention">主题切换</div> -->
        <div @click="mention">
          <el-input
            v-model="inputValue"
            class="input"
            placeholder="搜索本站"
          >
            <template #prefix>
              <el-icon class="el-input__icon"
                ><img
                  class="search-icon"
                  :src="search"
                  alt=""
              /></el-icon>
            </template>
          </el-input>
        </div>
        <div @click="mention">分类</div>
        <div @click="mention">留言</div>
        <div @click="mention">友情链接</div>
        <div @click="mention">关于</div>
      </template>
      <template v-if="themeStore.isMobile()">
        <img
          class="mobile-menu"
          src="@/assets/icons/catalogue.png"
          alt=""
          @click="drawer = true"
        />
        <el-input
          v-model="inputValue"
          class="input"
          placeholder="搜索本站"
        >
          <template #prefix>
            <el-icon class="el-input__icon"
              ><img
                class="search-icon"
                :src="search"
                alt=""
            /></el-icon>
          </template>
        </el-input>
        <el-drawer
          v-model="drawer"
          direction="ltr"
          size="50%"
          title="I am the title"
          :lock-scroll="false"
        >
          <span>Hi there!</span>
        </el-drawer>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { throttle } from "lodash";
import { ElMessage } from "element-plus";
import theme from "@/assets/icons/theme.png";
import search from "@/assets/icons/search.png";
import menu from "@/assets/svg/pc_catalogue.svg";
import { useThemeStore } from "@/store/theme";

let removeResizeListener;

const themeStore = useThemeStore();
const menuList = [
  { title: "主题切换", icon: theme, action: () => mention },
  { title: "搜索", icon: search, action: () => mention },
  { title: "分类", icon: search, action: () => mention },
  { title: "留言", icon: search, action: () => mention },
  { title: "友情链接", icon: search, action: () => mention },
  { title: "关于", icon: search, action: () => mention },
];
const router = useRouter();
const drawer = ref(false);
const inputValue = ref("");
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
  removeResizeListener = themeStore.listenResize();
});
onUnmounted(() => {
  window.removeEventListener("wheel", throttledShowOrHide);
  if (removeResizeListener) removeResizeListener();
});
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
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
    color: white;
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
      .top-icon {
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
      width: 500px;
      justify-content: space-evenly;
      animation: fadeIn 0.8s ease-out;
      div {
        cursor: pointer;
      }
    }
  }
  .search-icon {
    width: 20px;
    height: 20px;
  }
  .input {
    width: 180px;
    margin-left: 10px;
  }
}

@media (max-width: 768px) {
  .wrapper {
    width: 100%;
    height: 60px;
    position: fixed;
    top: 0;
    z-index: 999;
    // color: white;
    transition: 0.3s;
  }
  .right {
    order: 1;
    .mobile-menu {
      width: 25px;
      margin: 0 10px;
    }
  }
  .left {
    order: 2;
    .top-icon {
      // order: 2;
      width: 50px;
      border-radius: 50%;
      margin: 5px 10px;
    }
    .name {
      // order: 1;
      margin-right: 10px;
    }
  }
  .search-icon {
    width: 20px;
    height: 20px;
  }
  .input {
    width: 180px;
    margin-left: 10px;
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
