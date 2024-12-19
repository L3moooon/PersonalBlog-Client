<template>
  <div class="wrapper">
    <div class="left">
      <img src="../../assets/portrait.jpg" />
      <span>{{ useStore.nickname }}</span>
    </div>
    <div class="right">
      <div>主题切换</div>
      <div>搜索</div>
      <div>文章</div>
      <div>我的</div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
const useStore = useUserStore();
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;

  display: flex;
  justify-content: space-between;
  align-items: center;

  // overflow: hidden;
  // height: 0;
  // padding: 0;
  // transition: all 0.5s ease-out;
  .left {
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
    width: 700px;
    color: white;
    font-size: 20px;
    font-weight: 500;
    justify-content: space-evenly;
  }
}
</style>
