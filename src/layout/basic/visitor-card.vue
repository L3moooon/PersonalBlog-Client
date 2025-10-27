<template>
  <div class="author">
    <div
      class="info"
      @mousemove="cardTransform($event)"
      @mouseleave="resetCardTransform($event)"
    >
      <img
        :src="computedPortrait"
        id="card-img"
        class="card__shine"
      />
      <div class="name">{{ visitor.name }}</div>
      <!-- 早上好，下午好，晚上好 -->
      <div class="greeting">欢迎到访</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { throttle } from "lodash";
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
onMounted(() => {
  const info = JSON.parse(localStorage.getItem("visitor"));
  Object.assign(visitor, info);
  console.log(visitor);
});
</script>

<style lang="scss" scoped>
.author {
  width: 100%;
  height: 186px;
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  opacity: 0.9;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
  .info {
    overflow: hidden;
  }
  img {
    display: block;
    width: 96px;
    height: 96px;
    border-radius: 10px;
    margin: 16px auto;
    transition: 0.5s;
    transform-style: preserve-3d;
  }
  .name {
    font-size: 16px;
    text-align: center;
    margin: 8px;
    overflow: hidden;
  }
  .greeting {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    margin: 5px;
  }
}
</style>
