<template>
  <div class="live-container">
    <div
      class="card"
      v-for="item in liveData"
      :key="item.type"
      @click="goRoute(item.id)"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const liveData = [
  {
    type: "游戏",
    introduce: "重度游戏爱好者，酷爱开放世界/模拟生存/僵尸类游戏",
    detail: [
      { name: "饥荒", cover: "", text: "", url: "" },
      { name: "星露谷物语", cover: "", text: "", url: "" },
      { name: "潜水员戴夫", cover: "", text: "", url: "" },
      { name: "艾尔登法环", cover: "", text: "", url: "" },
    ],
  },
  {
    type: "动漫",

    introduce: "高中和大学时比较爱看，现在已经脱宅了",
    detail: [
      { name: "命运石之门", cover: "", text: "", url: "" },
      { name: "化物语", cover: "", text: "", url: "" },
      { name: "游戏人生", cover: "", text: "", url: "" },
      { name: "进击的巨人", cover: "", text: "", url: "" },
    ],
  },
  {
    type: "电影",

    introduce: "周星驰和林正英的电影已经循环到会背台词了",
    detail: [
      { name: "剑雨", cover: "", text: "", url: "" },
      { name: "星际穿越", cover: "", text: "", url: "" },
      { name: "第九区", cover: "", text: "", url: "" },
      { name: "僵尸世界大战", cover: "", text: "", url: "" },
    ],
  },
  {
    type: "小说",
    introduce: "网文无脑爽",
    detail: [
      { name: "神秘复苏", cover: "", text: "", url: "" },
      { name: "说谎的男孩和坏掉的女孩", cover: "", text: "", url: "" },
      { name: "遮天", cover: "", text: "", url: "" },
      { name: "夏天一到，你一死就完美无缺", cover: "", text: "", url: "" },
      { name: "我的青春恋爱物语果然有问题", cover: "", text: "", url: "" },
    ],
  },
  {
    type: "音乐",
    introduce: "比较喜欢朋克/经典粤语/欧美流行",
    detail: [
      { name: "Drunk Groove", cover: "", text: "", url: "" },
      { name: "吻的太逼真", cover: "", text: "", url: "" },
      { name: "Apologize", cover: "", text: "", url: "" },
      { name: "饥荒", cover: "", text: "", url: "" },
    ],
  },
  {
    type: "健身",
    introduce: "健身会带给我力量，无论是身还是心",
    detail: [
      { name: "练胸日", cover: "", text: "", url: "" },
      { name: "练背日", cover: "", text: "", url: "" },
      { name: "练腿日", cover: "", text: "", url: "" },
    ],
  },
  {
    type: "宠物",
    introduce: "一只不会说话的的跟屁虫",
    detail: [
      { name: "咖啡", cover: "", text: "", url: "" },
      { name: "咖啡", cover: "", text: "", url: "" },
      { name: "咖啡", cover: "", text: "", url: "" },
      { name: "咖啡", cover: "", text: "", url: "" },
    ],
  },
];
</script>

<style lang="scss" scoped>
.live-container {
  padding: 10px;
}
</style>
