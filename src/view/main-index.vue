<template>
  <div class="home-container">
    <div
      class="card"
      v-for="item in articleList"
      :key="item.id"
      @click="goRoute(item.id)">
      <div
        v-if="item.cover_img"
        class="home-cover">
        <img
          :src="item.cover_img"
          alt="" />
      </div>
      <div
        v-else
        class="home-cover">
        暂无封面
      </div>
      <div class="content">
        <div class="title">{{ item.title }}</div>
        <div class="tag">
          <img
            src="@/assets/icons/tag.png"
            alt="" />
          <div
            class="tag-item"
            v-for="(tag, index) in item.tag"
            :key="index">
            {{ tag.name }}
          </div>
        </div>
        <div class="abstract">{{ item.abstract || "暂无简介" }}</div>
        <div class="detail">
          <div class="time">
            <img
              src="@/assets/icons/time.png"
              alt="" />
            <span v-timeFormatter:YYYY-MM-DD="item.last_edit_date"></span>
          </div>
          <div class="like">
            <img
              src="@/assets/icons/like.png"
              alt="" />
            {{ item.star }}
          </div>
          <div class="view">
            <img
              src="@/assets/icons/view.png"
              alt="" />
            {{ item.view }}
          </div>
          <div class="comments">
            <img
              src="@/assets/icons/评论.png"
              alt="" />
            {{ item.comment_count }}
          </div>
        </div>
      </div>
      <!-- 置顶 -->
      <div
        class="top"
        v-if="item.top">
        置顶
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getHomeData } from "@/api/home";
import { useRouter } from "vue-router";
const router = useRouter();
const articleList = ref([]);
onMounted(async () => {
  const { data, status } = await getHomeData();
  articleList.value = data;
});

const goRoute = (id) => {
  router.push({ path: "/article", query: { id } });
};
</script>

<style lang="scss" scoped>
.home-container {
  overflow: hidden; //解决高度塌陷
  height: 100%;
  .card {
    padding: 10px;
    margin: 16px 16px;
    height: 180px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.1),
      -18px -18px 30px rgba(255, 255, 255, 1);
    transition: box-shadow 0.2s ease-out;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2),
        0px 0px 0px rgba(255, 255, 255, 0.8),
        inset 18px 18px 30px rgba(0, 0, 0, 0.1),
        inset -18px -18px 30px rgba(255, 255, 255, 1);
      transition: box-shadow 0.2s ease-out;
      .home-cover img {
        scale: 1.2;
        transition: 0.3s;
      }
    }
    .home-cover {
      width: 40%;
      // width: 280px;
      height: 180px;
      border-radius: 10px;
      font-size: 30px;
      font-weight: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        transition: 0.3s;
      }
    }

    .content {
      width: 60%;
      padding-left: 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        height: 30px;
        padding: 24px 0 10px 0;
        font-size: 24px;
        font-weight: 500;
        color: #555555;
      }
      .tag {
        font-size: 14px;
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        gap: 10px;
        img {
          width: 15px;
          height: 15px;
        }
        .tag-item {
          background-color: antiquewhite;
          height: 20px;
          line-height: 20px;
          padding: 0 10px;
          border-radius: 5px;
          text-align: center;
        }
      }
      .abstract {
        height: 60px;
        font-size: 14px;
        font-weight: 200;
        color: #a0a0a0;
        display: flex;
        align-items: center;
      }
      .detail {
        height: 30px;
        display: flex;
        align-items: center;
        width: 90%;
        justify-content: space-between;
        // gap: 60px;
        font-size: 15px;
        font-weight: 200;
        color: #a0a0a0;
        .time,
        .like,
        .view,
        .comments {
          display: flex;
          height: 100%;
          align-items: center;
          white-space: nowrap;
          overflow: hideen;
          text-overflow: ellipsis;
          img {
            width: 15px;
            height: 15px;
            margin-right: 5px;
          }
        }
      }
    }
    .top {
      width: 200px;
      height: 50px;
      background: linear-gradient(135deg, #c42c2c, #a02424);
      position: absolute;
      right: -65px;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3),
        /* 外部阴影：模拟光线投射的阴影 */ inset 0 1px 2px
          rgba(255, 255, 255, 0.2); /* 内部阴影：模拟高光 */
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      font-weight: 500; /* 加粗文字，增强存在感 */
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2); /* 文字阴影，让文字更立体 */
      // 增加细微的旋转偏差，避免过于规整
      transform: rotate(45deg) skew(-2deg, -2deg);
    }
  }
}
</style>
