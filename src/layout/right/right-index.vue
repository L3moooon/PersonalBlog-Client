<template>
  <div class="author">
    <img src="../../assets/微信图片_20241216162400.jpg" />
    宵时雨
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUserInfo } from "@/api/user/index.js";
const user = ref([]);
onMounted(async () => {
  const { data } = await getUserInfo();
  user.value = data;
  console.log(data);
});
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
