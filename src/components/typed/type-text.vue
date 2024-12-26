<template>
  <div class="text-box">
    <span
      id="type-list"
      class="text"
    ></span>
    <span
      class="line"
      :class="{ blink: blinkLine }"
      >|</span
    >
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps(["text"]);
watch(
  () => props.text,

  async () => {
    for (const item of props.text) {
      const arr = item.split("");
      // console.log(stringArr);
      const type = new Promise((resolve, reject) => {
        const container = document.getElementById("type-list");
        //设置一个定时器
        let i = 0;
        //等待1s后持续添加文字
        setTimeout(() => {
          blinkLine.value = false;
          const timer = setInterval(() => {
            if (i < arr.length) {
              // console.log(container.innerHTML);
              container.innerHTML += arr[i];
              i++;
            }
            //如果添加完成
            else {
              clearInterval(timer);
              //等待1s后持续删除文字
              // console.log(container.innerHTML);
              blinkLine.value = true;
              setTimeout(() => {
                blinkLine.value = false;
                // console.log(i);
                const timer = setInterval(() => {
                  // console.log(container.innerHTML, i);
                  if (i > 0) {
                    container.innerHTML = container.innerHTML.slice(0, i - 1);
                    i--;
                  } else {
                    clearInterval(timer);
                    blinkLine.value = true;
                    resolve();
                  }
                }, 90);
              }, 1500);
            }
          }, 350);
        }, 1500);
      });
      await type;
    }
  }
);
const blinkLine = ref("false");
</script>

<style lang="scss" scoped>
.text-box {
  margin: 1rem 0;
  height: 2rem;
  line-height: 2rem;
  // display: flex;
  .text {
    display: inline-block;
    // width: 0;
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
    height: 2rem;
    line-height: 2rem;
    font-size: 40px;
    vertical-align: top;
  }
  .blink {
    animation: blink 0.75s ease-in-out 0s infinite;
  }
}
</style>
