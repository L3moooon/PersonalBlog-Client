<template>
  <div
    class="author"
    @mousemove="cardTransform($event)"
    @mouseleave="resetCardTransform($event)"
  >
    <img
      src="../../assets/微信图片_20241216162400.jpg"
      id="card-img"
      class="card__shine"
    />
    <div class="name">{{ useStore.nickname }}</div>
    <div class="greeting">心中有方向，脚步有力量</div>
    <div class="link">
      <div class="url" v-for="(item, index) in useStore.url" :key="index">
        <a :href="item.address" target="_blank">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="getIconLink(item.name)"></use>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
const useStore = useUserStore();

const cardTransform = (e) => {
  window.requestAnimationFrame(function () {
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
  });
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
</script>

<style lang="scss" scoped>
.author {
  width: 100%;
  height: 20rem;
  // background-color: rgba(241, 204, 143, 0.9);
  // background-color: rgba(235, 224, 224, 0.9);
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  opacity: 0.9;
  border-radius: 10px;
  // overflow: hidden;
  display: table;

  img {
    display: block;
    width: 8rem;
    // border-radius: 50%;
    border-radius: 10px;
    margin: 1.5rem auto;
    transition: 0.5s;
    transform-style: preserve-3d;
  }
  img:hover {
    // transform: rotate(360deg);
    // width: 10rem;
    // box-shadow: #83a4d4 solid 2px;
  }
  .name {
    font-size: 1.8rem;
    text-align: center;
    margin: 1.2rem;
  }
  .greeting {
    font-size: 1.2rem;
    // color: #87c5ee;
    text-align: center;
    margin: 1rem;
  }
  .link {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      color: black;
      margin: 0 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      transition: 0.3s;
    }
    svg:hover {
      width: 2.4rem;
      height: 2.4rem;
      color: gray;
    }
  }
}
.card__shine {
  --grain: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCI+CjxmaWx0ZXIgaWQ9Im4iPgo8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjEwIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIj48L2ZlVHVyYnVsZW5jZT4KPC9maWx0ZXI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjAuMyI+PC9yZWN0Pgo8L3N2Zz4=");

  --space: 5%;
  --angle: 133deg;
  --imgsize: 500px;

  --red: #f80e7b;
  --yel: #eedf10;
  --gre: #21e985;
  --blu: #0dbde9;
  --vio: #c929f1;
}
</style>
