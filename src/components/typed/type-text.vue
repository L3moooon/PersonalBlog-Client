<template>
  <div class="text-box">
    <span id="type-list" class="text"></span>
    <span class="line">|</span>
  </div>
</template>

<script setup>
import { defineProps, watch } from "vue";
const props = defineProps(["text"]);
watch(
  () => props.text,
  () => {
    const container = document.getElementById("type-list");
    const task = (i) => {
      let width = 0;
      const increase = setInterval(() => {
        width += 2;
        container.innerHTML = props.text[i];
        container.style.width = width + "rem";
        if (width >= props.text[i].length * 2) {
          clearInterval(increase);
          const decrease = setInterval(() => {
            width -= 2;
            container.style.width = width + "rem";
            if (width <= 0) {
              clearInterval(decrease);
              i++;
              if (i > props.text.length - 1) {
                i = 0;
              }
              task(i);
            }
          }, props.text[i].length * 10);
        }
      }, props.text[i].length * 20);
    };
    task(0);
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
