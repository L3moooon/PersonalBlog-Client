<template>
  <div class="author">
    <img src="../../assets/微信图片_20241216162400.jpg" />
    {{ useStore.nickname }}
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
const useStore = useUserStore();
</script>

<style lang="scss" scoped>
.author {
  width: 20%;
  height: 20rem;
  background-color: blanchedalmond;
  border-radius: 10px;
  img {
    display: block;
    width: 8rem;
    border-radius: 50%;
    margin: 1.5rem auto;
  }
}
</style>
