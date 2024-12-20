<template>
  <div class="slideshow">
    <div class="top-title">GitHub贡献日历</div>
    <div class="content">
      <div class="left-title"></div>
      <div id="git-calendar"></div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/store/user";
import { getGitCalendar } from "@/api/home";
const useStore = useUserStore();

const gitContributions = ref([]);
// onMounted(() => {
//   getUserName();
//   GenerateBlock();
// });
watch(
  () => useStore.url,
  async () => {
    await getUserName();
    GenerateBlock();
  }
);
const getUserName = async () => {
  const git = useStore.url.filter((item) => item.name == "Github");
  const username = git[0].address.match(/github.com\/([^/]+)/)[1];
  const data = await getGitCalendar(username);
  gitContributions.value = data;
  // console.log(gitContributions.value);
};
const gitColor = {
  0: "#ebedf0",
  1: "#dbedff",
  2: "#79b8ff",
  3: "#0366d6",
  4: "#044289",
};
const GenerateBlock = () => {
  const box = document.getElementById("git-calendar");
  const week = gitContributions.value.contributions;
  // console.log(gitContributions.value.contributions.length);
  for (let i = 0; i < week.length; i++) {
    for (let j = 0; j < week[i].length; j++) {
      const block = document.createElement("div");
      block.className = "block";
      block.style.backgroundColor =
        week[i][j].count >= 4 ? gitColor[4] : gitColor[week[i][j].count];
      block.style.borderRadius = "4px";
      box.appendChild(block);
    }
  }
};
// const setGitColor = (num, total) => {
//   const commitDegree = total / 5;
//   const colorDegree = [
//     0,
//     commitDegree,
//     commitDegree * 2,
//     commitDegree * 4,
//     total,
//   ];
// };
</script>

<style lang="scss" scoped>
.slideshow {
  height: 13rem;
  overflow: hidden;
  background-color: wheat;
  margin: 0 1rem 1rem 1rem;
  border-radius: 10px;

  .top-title {
    margin: 0.5rem auto;
    text-align: center;
  }
  .content {
    display: flex;
    justify-content: space-evenly;
    .left-title {
      width: 2rem;
      height: 5rem;
      background-color: black;
    }
    #git-calendar {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: repeat(53, 0.75rem);
      grid-template-rows: repeat(7, 0.75rem);
      gap: 2px;
      border-radius: 10px;
    }
  }
  .bottom {
    width: 100%;
    height: 5rem;
  }
}
.block {
  background-color: #ebedf0;
}
.block:hover {
  border: 1px solid black;
}
</style>
