<template>
  <div class="author">
    <div
      class="info"
      @mousemove="cardTransform($event)"
      @mouseleave="resetCardTransform($event)">
      <img
        :src="computedPortrait"
        id="card-img"
        class="card__shine" />
      <div class="name">游客 {{ visitor.name }}</div>
      <!-- 早上好，下午好，晚上好 -->
      <div class="greeting">欢迎到访</div>
    </div>

    <!-- <div class="link">
      <div
        class="url"
        v-for="(item, index) in useStore.url"
        :key="index">
        <a
          :href="item.address"
          target="_blank">
          <svg
            class="icon"
            aria-hidden="true">
            <use :xlink:href="getIconLink(item.name)"></use>
          </svg>
        </a>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { throttle } from "@/utils/throttle";
import { useThemeStore } from "@/store/theme";
const useStore = useThemeStore();
import anonymous from "@/assets/icons/personal.png";

const visitor = reactive({});
const computedPortrait = computed(() => {
  return visitor.portrait ? visitor.portrait : anonymous;
});
const cardTransform = (e) => {
  function changePos() {
    const degree = 0.4;
    const img = document.getElementById("card-img");
    const box = img.getBoundingClientRect();
    //鼠标x位置-box的位置-box中心点x的位置
    let calcY = e.clientX - box.x - box.width / 2;
    let calcX = e.clientY - box.y - box.height / 2;
    calcX = calcX > 0 ? Math.min(calcX, 75) : Math.max(calcX, -75);
    calcY = calcY > 0 ? Math.min(calcY, 75) : Math.max(calcY, -75);
    img.style.transform =
      "rotateY(" +
      calcY * degree +
      "deg) " +
      "rotateX(" +
      calcX * -degree +
      "deg) ";
  }
  window.requestAnimationFrame(throttle(changePos, 100));
};
const resetCardTransform = () => {
  window.requestAnimationFrame(function () {
    const img = document.getElementById("card-img");
    img.style.transform = "rotateX(0) rotateY(0)";
  });
};
// 使用对象字面量替代switch语句，更简洁地获取图标链接
const iconLinks = {
  Github: "#icon-github-fill",
  QQ: "#icon-changyonglogo33",
  Bilibili: "#icon-bilibili-line",
  Google: "#icon-logo-google",
  Wechat: "#icon-github-fill",
};
const getIconLink = (urlName) => iconLinks[urlName] || "";

onMounted(() => {
  const info = JSON.parse(localStorage.getItem("visitor"));
  // console.log(visitor.value);
  Object.assign(visitor, info);
  console.log(visitor);
});
</script>

<style lang="scss" scoped>
.author {
  width: 100%;
  height: 13rem;
  // background-color: rgba(241, 204, 143, 0.9);
  // background-color: rgba(235, 224, 224, 0.9);
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  opacity: 0.9;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
  .info {
    overflow: hidden;
  }
  img {
    display: block;
    width: 6rem;
    // border-radius: 50%;
    border-radius: 10px;
    margin: 1rem auto;
    transition: 0.5s;
    transform-style: preserve-3d;
  }
  img:hover {
    // transform: rotate(360deg);
    // width: 10rem;
    // box-shadow: #83a4d4 solid 2px;
  }
  .name {
    font-size: 1rem;
    text-align: center;
    margin: 0.5rem;
    overflow: hidden;
  }
  .greeting {
    // font-family: SiJiYuNi;
    font-size: 0.8rem;
    font-weight: 500;
    text-align: center;
    margin: 0.3rem;
  }
  .link {
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      color: #303133;
      margin: 0 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      transition: 0.3s;
    }
    svg:hover {
      width: 2.2rem;
      height: 2.2rem;
      color: #20b0e3;
    }
  }
}
</style>
