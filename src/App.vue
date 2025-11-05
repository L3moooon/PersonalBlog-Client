<template>
	<router-view></router-view>
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
