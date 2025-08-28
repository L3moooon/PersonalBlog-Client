<template>
  <div class="hot">
    <div class="title">
      <div class="title-text flex-center">
        <img
          src="@/assets/icons/hot-for-ux-fill.png"
          alt="" />
        <span> 热门文章 </span>
      </div>
    </div>
    <div class="content">
      <div
        class="item"
        v-for="item in pagination.articles"
        :key="item.id"
        @click="handleJump(item.id)">
        <div class="cover">
          <img
            v-if="item.cover_img.length"
            :src="item.cover_img"
            alt="" />
          <div
            v-else
            class="flex-center">
            <span>暂无封面</span>
          </div>
        </div>
        <div class="right">
          <div class="title">{{ item.title }}</div>
          <div
            class="time"
            v-timeFormatter:YYYY-MM-DD="item.publish_date"></div>
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
    padding: 0 5px;
    .item {
      cursor: pointer;
      transition: 0.3s;
      background-color: #b1c8cc;
      // background: linear-gradient(135deg, #4ca1af, #c4e0e5);
      // box-shadow: 2px 2px 5px #e6c481;
      border-radius: 5px;
      height: 75px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      &:hover {
        // box-shadow: 2px 2px 5px #876a40;
        transition: 0.3s;
      }
      .cover {
        width: 100px;
        height: 60px;
        margin: 0 10px 0 5px;
        div {
          background-color: #fff;
          border-radius: 5px;
          width: 100%;
          height: 100%;
        }
      }
      .right {
        .title {
        }
      }
    }
  }
}
</style>
