<template>
  <div class="text-box">
    <span
      id="type-list"
      class="text"></span>
    <span
      class="line"
      :class="{ blink: blinkLine }"
      >|</span
    >
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
const props = defineProps(["text"]);

const containerElement = ref(null);
const blinkLine = ref("false");

async function typePoem(poemArr) {
  let i = 0;
  while (i < poemArr.length) {
    //光标动画间隔0.75s，waitBegin的间隔时间最好是750ms的整数倍
    await waitBegin(2250);
    await typeText(poemArr[i], 350);
    await waitBegin(2250);
    await delText(poemArr[i], 90);
    //无限循环
    i++;
    if (i == poemArr.length) i = 0;
  }
  function waitBegin(delay) {
    blinkLine.value = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }
  function typeText(poem, delay) {
    let pointer = 0;
    blinkLine.value = false;
    return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        containerElement.value.textContent += poem[pointer++];
      }, delay);
      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, delay * poem.length);
    });
  }
  function delText(poem, delay) {
    blinkLine.value = false;
    let pointer = poem.length - 1;
    return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        containerElement.value.textContent = poem.slice(0, pointer);
        pointer--;
      }, delay);
      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, delay * poem.length);
    });
  }
}
onMounted(() => {
  typePoem(props.text);
  containerElement.value = document.getElementById("type-list");
});
</script>

<style lang="scss" scoped>
.text-box {
  margin: 1rem 0;
  height: 2rem;
  line-height: 2rem;
  .text {
    display: inline-block;
    height: 2rem;
    white-space: nowrap;
    font-size: 2rem;
    overflow: hidden;
  }
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .line {
    font-family: Arial, Helvetica, sans-serif;
    display: inline-block;
    height: 32px;
    line-height: 2rem;
    font-size: 35px;
    transform: scaleX(0.6); /* 水平方向缩放到 50% */
    vertical-align: top;
  }
  .blink {
    animation: blink 0.75s ease-in-out 0s infinite;
  }
}
</style>
