<template>
  <div class="text-box">
    <span
      id="type-list"
      class="text"
    ></span>
    <span class="line">|</span>
  </div>
</template>

<script setup>
import { defineProps, watch } from "vue";
const props = defineProps(["text"]);
watch(
  () => props.text,
  () => {
    // const container = document.getElementById("type-list");
    // const task = (i) => {
    //   let width = 0;
    //   const increase = setInterval(() => {
    //     width += 2;
    //     container.innerHTML = props.text[i];
    //     container.style.width = width + "rem";
    //     if (width >= props.text[i].length * 2) {
    //       clearInterval(increase);
    //       const decrease = setInterval(() => {
    //         width -= 2;
    //         container.style.width = width + "rem";
    //         if (width <= 0) {
    //           clearInterval(decrease);
    //           i++;
    //           if (i > props.text.length - 1) {
    //             i = 0;
    //           }
    //           task(i);
    //         }
    //       }, props.text[i].length * 10);
    //     }
    //   }, props.text[i].length * 20);
    // };
    // task(0);
    const container = document.getElementById("type-list");
    // let i = 0;
    const task = new Promise((resolve) => {
      setTimeout(() => {
        // TODO 输入光标闪烁效果
        let index = 0;
        resolve(index);
      }, 1000);
    });
    for (let char of props.text[index]) {
      task.then(() => {
        const timer = setTimeout(() => {
          container.innerHTML += char;
        }, 300);
      });
    }
    // task
    //   .then((index) => {
    //     console.log(props.text[index], props.text[index].split(""));

    //     const stringArr = props.text[index].split("");
    //     let pos = 0;
    //     const increase = setInterval(() => {
    //       if (pos < props.text[index].length) {
    //         container.innerHTML += stringArr[pos++];
    //       } else {
    //         clearInterval(increase);
    //         return index;
    //       }
    //     }, 300);
    //   })
    //   .then((index) => {
    //     setTimeout(() => index, 1000);
    //   })
    //   .then((index) => {
    //     const stringArr = props.text[index].split("");
    //     let pos = props.text[index].length - 1;
    //     const decrease = setInterval(() => {
    //       if (pos > 0) {
    //         container.innerHTML -= stringArr[pos--];
    //       } else {
    //         clearInterval(decrease);
    //       }
    //     }, 150);
    //   });
  }
);
</script>

<style lang="scss" scoped>
.text-box {
  margin: 1rem 0;
  height: 2rem;
  line-height: 2rem;
  // display: flex;
  .text {
    display: inline-block;
    width: 0;
    height: 2rem;
    white-space: nowrap;
    font-size: 2rem;
    overflow: hidden;
  }
  .line {
    display: inline-block;
    height: 2rem;
    line-height: 2rem;
    font-size: 2rem;
    vertical-align: top;
  }
}
</style>
