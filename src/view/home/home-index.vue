<template>
  <div class="container">
    <div
      class="card"
      v-for="item in data"
      :key="item.id"
    >
      <div class="title">{{ item.title }}</div>
      <div class="content">{{ item.content }}</div>
      <div class="detail">
        <div class="time">
          <el-icon> <Clock /> </el-icon>
          {{ item.time }}
        </div>
        <div class="read">{{ item.read }}</div>
        <span
          v-for="(v, k) in item.tag"
          :key="k"
        >
          {{ v }}|
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getHomeData } from "@/api/home";
const data = ref([
  {
    id: Number,
    title: String,
    content: String,
    time: Number,
    tag: String,
    author: String,
    read: Number,
    img: String,
  },
]);
onMounted(async () => {
  const data = await getHomeData();
  console.log(1111, data);
});
// const data = ref([
//   {
//     id: 1,
//     title: "我的骄傲大魔王看",
//     content:
//       "发v骄傲能触发我i了你发来你发论文你疯啦南非我擦了你出发了你吃饭挖了吃饭了发你妇女擦了你发物流发你",
//     time: "2139014821",
//     tag: ["memo", "game"],
//     author: "willi",
//     comment: { username: "张", content: "21313", reply: "" },
//     read: 2000,
//     img: "/",
//   },
//   {
//     id: 2,
//     title: "的看非常平稳",
//     time: "2139014821",
//     tag: ["memo", "game"],
//     author: "willi",
//     comment: { username: "张", content: "21313", reply: "" },
//     read: 2000,
//     img: "/",
//   },
//   {
//     id: 3,
//     title: "放大我啊澳门看",
//     time: "2139014821",
//     tag: ["memo", "game"],
//     author: "willi",
//     comment: { username: "张", content: "21313", reply: "" },
//     read: 2000,
//     img: "/",
//   },
//   {
//     id: 4,
//     title: "吃辣节目的卡我",
//     time: "2139014821",
//     tag: ["memo", "game"],
//     author: "willi",
//     comment: { username: "张", content: "21313", reply: "" },
//     read: 2000,
//     img: "/",
//   },
// ]);
</script>

<style lang="scss" scoped>
.container {
  background-color: #f1f3f4;
  margin: 0 1rem;
  border-radius: 5px;
  overflow: hidden; //解决高度塌陷
}
.card {
  margin: 1rem 1rem;
  height: 200px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 5px;
  padding-left: 1rem;
  .title {
    height: 30px;
    padding: 1.5rem 1rem;
    font-size: 30px;
    font-weight: 500;
    color: #555555;
  }
  .content {
    font-size: 18px;
    font-weight: 200;
    color: #a0a0a0;
  }
  .detail {
    display: flex;
  }
}
</style>
