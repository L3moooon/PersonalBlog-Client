<template>
  <div class="hot">
    <div class="title">
      <div class="title-text flex-center">
        <img
          src="@/assets/icons/hot-for-ux-fill.png"
          alt=""
        />
        <span> 热门文章 </span>
      </div>
    </div>
    <div class="content">
      <div
        class="item"
        v-for="(item, index) in pagination.articles"
        :key="item.id"
        @click="handleJump(item.id)"
      >
        <div
          class="number flex-center"
          :class="{
            top1: index == 0,
            top2: index == 1,
            top3: index == 2,
          }"
        >
          {{ index + 1 }}
        </div>
        <div class="right flex-center">
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getRecommendArticle } from "@/api/home";
const route = useRoute();
const router = useRouter();
const pagination = reactive({
  page: 1, // 当前页码，初始为1
  limit: 5, // 每页条数，与后端约定（固定5条）
  articles: [], // 已加载的所有文章列表
  hasMore: true, // 是否还有更多数据（控制“加载更多”按钮显示）
  isLoading: false, // 加载中状态（防止重复点击）
});
const getList = async () => {
  const { data, status, hasMore } = await getRecommendArticle({
    page: pagination.page,
    limit: pagination.limit,
  });
  if (status == 1) {
    pagination.articles = data;
    pagination.page++;
    pagination.hasMore = hasMore;
  }
};
const handleJump = (id) => {
  router.push({ path: "/article", query: { id } });
};
const handleRefresh = () => {
  getList();
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.hot {
  // height: 420px;
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  opacity: 0.9;
  border-radius: 10px;
  overflow: hidden;
  padding: 5px;
  .title {
    display: flex;
    justify-content: space-between;
    margin: 0 0 10px 5px;
    .title-text,
    .title-func {
      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
    }
    .title-func {
      cursor: pointer;
      margin-right: 10px;
    }
  }
  .content {
    .item {
      cursor: pointer;
      transition: 0.3s;
      border-radius: 5px;
      height: 30px;
      margin-bottom: 10px;
      padding: 0 5px;
      display: flex;
      align-items: center;
      border: 1px solid transparent;
      &:hover {
        transform: translateY(-10%) translateX(10%) scale(1.1);
        transition: 0.3s;
      }
      .number {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background-color: #b1c8cc;
      }
      .top1 {
        background-color: #f85b1b;
      }
      .top2 {
        background-color: #f97f4e;
      }
      .top3 {
        background-color: #fba480;
      }

      .right {
        margin-left: 10px;
      }
    }
  }
}
</style>
