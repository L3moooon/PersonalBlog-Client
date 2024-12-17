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
  <div class="main">
    <div class="name">{{ useStore.nickname }}</div>
    <TypeText :text="useStore.saying"></TypeText>
    <!-- <div class="saying">欢迎来到我的博客</div> -->
    <button @click="turnDownPage">Let's Begin</button>
  </div>
</template>

<script setup>
import "@/styles/scrollbar.scss";
import { useUserStore } from "@/store/user";
import TypeText from "@/components/typed/type-text.vue";
const useStore = useUserStore();
const turnDownPage = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth", // 平滑滚动效果
  });
};
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
// .wrapper:hover {
//   background-color: rgba($color: #e0e8ea, $alpha: 0.8);
//   transition: 0.8s;
// }
.main {
  width: 100%;
  height: 100vh;
  padding: 0 auto;
  // position: absolute;
  // left: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 50px;
  font-weight: 500;
  // width: 500px;
  // height: 200px;
  // backdrop-filter: blur(3px);
  border-radius: 30px;
  .saying {
    width: fit-content;
    margin: 1rem auto;
  }
  button {
    display: block;
    height: 40px;
    width: 100px;
    background-color: #e9c669;
    border-radius: 5px;
    font-weight: 500;
    margin: 1rem auto;
    cursor: pointer;
  }
}
</style>
