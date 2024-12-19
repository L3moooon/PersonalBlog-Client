<template>
  <div class="container">
    <div class="top-title">GitHub贡献日历</div>
    <div class="content">
      <div class="left-title"></div>
      <div id="git-calendar"></div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/user";
import { getGitCalendar } from "@/api/home";

const gitContributions = ref([]);
onMounted(async () => {
  getUserName();
  GenerateBlock();
});
const getUserName = () => {
  const useStore = useUserStore();
  const git = useStore.url.filter((item) => item.name == "Github");
  const username = git[0].address.match(/github.com\/([^/]+)/)[1];
  const { data } = getGitCalendar(username);
  gitContributions.value = data;
};
const GenerateBlock = () => {
  const box = document.getElementById("git-calendar");
  for (let i = 0; i < 365; i++) {
    const block = document.createElement("div");
    block.className = "block";
    // block.style.width = "10px";
    // block.style.height = "10px";
    block.style.backgroundColor = "black";
    // block.style.margin = "1px";
    box.appendChild(block);
  }
};
</script>

<style lang="scss" scoped>
.top-title {
  margin: 0.5rem auto;
  text-align: center;
}
#git-calendar {
  display: grid;
  // width: 100%;
  // height: 10rem;
  // background-color: aqua;
  grid-auto-flow: column;
  grid-template-columns: repeat(53, 0.75rem);
  grid-template-rows: repeat(7, 0.75rem);
  gap: 2px;
  // row-gap: 2px;
  // column-gap: 2px;
  border-radius: 10px;
}
</style>
