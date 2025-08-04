<template>
  <TopbarMenu></TopbarMenu>
  <div class="main">
    <div class="name">{{ themeStore.themeData.welcome }}</div>
    <TypeText :text="themeStore.saying"></TypeText>
    <button
      @click="turnDownPage"
      class="button">
      初章
    </button>
  </div>
</template>

<script setup>
import { useThemeStore } from "@/store/theme";
import TypeText from "@/components/typed/type-text.vue";
import TopbarMenu from "@/components/topbar/topbar-menu.vue";
import "@/styles/poem-font.css";
const themeStore = useThemeStore();
const turnDownPage = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth", // 平滑滚动效果
  });
};
</script>

<style lang="scss" scoped>
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

  // width: 500px;
  // height: 200px;
  // backdrop-filter: blur(3px);
  border-radius: 30px;
  font-family: SiJiYuNi;
  .name {
    font-size: 4rem;
    font-weight: 500;
  }
  .button {
    font-family: SiJiYuNi;
    font-size: 1rem;
    color: white;
    display: block;
    height: 40px;
    width: 100px;
    background-color: #e9c669;
    border-radius: 5px;
    font-weight: 500;
    margin: 1rem auto;
    cursor: pointer;
    border: 1px solid #e0be6e;
    box-shadow: 10px;
  }
}
</style>
