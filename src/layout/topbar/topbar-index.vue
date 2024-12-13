<template>
  <div class="container">
    <div class="left">
      <img src="../../assets/portrait.jpg" />
      <span>宵时雨</span>
    </div>
    <div class="right">
      <div>主题切换</div>
      <div>搜索</div>
      <div>文章</div>
      <div>我的</div>
    </div>
  </div>
  <div class="main">
    <div class="title">欢迎来到我的博客</div>
    <button>Let's Begin</button>
  </div>
</template>

<script setup>
import "@/styles/scrollbar.scss";
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.main {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 50px;
  font-weight: 500;
  width: 500px;
  height: 200px;
  // backdrop-filter: blur(3px);
  border-radius: 30px;
  .title {
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
