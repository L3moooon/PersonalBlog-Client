<template>
  <!-- <router-view></router-view>
    -->
  <router-view v-slot="{ Component, route }">
    <!-- 使用任何自定义过渡和回退到 `fade` -->
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script setup>
import "./styles/reset.scss";
import "@/utils/rem";
import "@/font/iconfont";
import "element-plus/dist/index.css";
import "@/styles/icon.css";
import "@/styles/scrollbar.scss"; //滚动条
import "@/styles/transitions.css"; //路由跳转
import "@/styles/public.scss";
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #303133;
  font-size: 16px;
}
</style>
