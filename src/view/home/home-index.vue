<template>
  <div class="container">
    <div class="card">
      <GitCalendar></GitCalendar>
    </div>
    <div
      class="card"
      v-for="item in articleList"
      :key="item.id"
      @click="goRoute"
    >
      <div class="title">{{ item.title }}</div>
      <div class="content">{{ item.content }}</div>
      <div class="detail">
        <!-- <div class="time">
          <el-icon> <Clock /> </el-icon>
          {{ item.publish_date }}
        </div> -->
        <div class="read">{{ item.view }}</div>
        <!-- <span
          v-for="(v, k) in item.tag"
          :key="k"
        >
          {{ v }}|
        </span> -->
      </div>
    </div>
    <div class="nosense">nosense</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getHomeData } from "@/api/home";
import { useRouter } from "vue-router";
import GitCalendar from "@/components/gitCalendar/git-calendar.vue";

const articleList = ref([]);
onMounted(async () => {
  const { data } = await getHomeData();
  articleList.value = data;
});

const $router = useRouter();
const goRoute = () => {
  $router.push({ path: "/article", query: { id: articleList.value.id } });
};
</script>

<style lang="scss" scoped>
.container {
  // background-color: #f1f3f4;
  background-color: #efeeee;
  margin: 0 1rem;
  border-radius: 10px;
  overflow: hidden; //解决高度塌陷
  .card {
    margin: 1rem 1rem;
    height: 200px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
      -18px -18px 30px rgba(255, 255, 255, 1);
    transition: box-shadow 0.2s ease-out;
    cursor: pointer;
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
  .card:hover {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
      0px 0px 0px rgba(255, 255, 255, 0.8),
      inset 18px 18px 30px rgba(0, 0, 0, 0.1),
      inset -18px -18px 30px rgba(255, 255, 255, 1);
    transition: box-shadow 0.2s ease-out;
  }
  .nosense {
    height: 100rem;
  }
}
</style>
