<template>
  <div class="hot">
    <div class="title">推荐文章</div>
    <div class="content">
      <div class="item">1</div>
      <div class="item">1</div>
      <div class="item">1</div>
      <div class="item">1</div>
      <div class="item">1</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
onMounted(() => {});
</script>

<style lang="scss" scoped>
.hot {
  height: 20rem;
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  opacity: 0.9;
  border-radius: 10px;
  overflow: hidden;
}
</style>
