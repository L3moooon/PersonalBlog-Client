<template>
	<router-view></router-view>

	<!-- 使用任何自定义过渡和回退到 `fade` -->
	<!-- <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" />
    </transition>
  </router-view> -->
</template>
<script setup>
import "./styles/reset.scss";
import "@/styles/public.scss"; //公共样式

import "element-plus/dist/index.css";
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #303133;
	font-size: 16px;
}
</style>
