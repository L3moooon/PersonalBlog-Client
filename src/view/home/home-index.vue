<template>
  <div class="container">
    <div
      class="card"
      v-for="item in data"
      :key="item.id"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const data = ref([
  {
    id: 1,
    title: "我的骄傲大魔王看",
    time: "2139014821",
    tag: ["memo", "game"],
    comment: { username: "张", content: "21313", reply: "" },
  },
  {
    id: 2,
    title: "的看非常平稳",
    time: "2139014821",
    tag: ["memo", "game"],
    comment: { username: "张", content: "21313", reply: "" },
  },
  {
    id: 3,
    title: "放大我啊澳门看",
    time: "2139014821",
    tag: ["memo", "game"],
    comment: { username: "张", content: "21313", reply: "" },
  },
  {
    id: 4,
    title: "吃辣节目的卡我",
    time: "2139014821",
    tag: ["memo", "game"],
    comment: { username: "张", content: "21313", reply: "" },
  },
]);
</script>

<style lang="scss" scoped></style>
