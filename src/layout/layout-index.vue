<template>
  <div class="container">
    <div class="top">
      <TopbarIndex></TopbarIndex>
    </div>

    <div class="down">
      <LeftIndex></LeftIndex>
      <ContentIndex></ContentIndex>
      <RightIndex></RightIndex>
    </div>
  </div>
</template>

<script setup>
import TopbarIndex from "./topbar/topbar-index.vue";
import LeftIndex from "./left/left-index.vue";
import ContentIndex from "./content/content-index.vue";
import RightIndex from "./right/right-index.vue";
</script>

<style lang="scss" scoped>
.container {
  background-image: url("../assets/night.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.top {
  // position: relative;
  // img {
  //   width: 100%;
  //   height: 100vh;
  //   object-fit: cover;
  // }
}
.down {
  // height: 200px;
  display: flex;
  width: 70%;
  margin: 0 auto;
  justify-content: space-between;
  // align-items: center;
  flex-grow: 1 2 1;
}
</style>
