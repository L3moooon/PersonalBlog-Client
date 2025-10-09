<template>
  <div class="toc-content">
    <div class="toc-list">
      <div
        v-for="(item, index) in props.catagory"
        :key="index"
        class="toc-item"
        @click.stop
        @click.prevent="scrollToSection(item.id)">
        <a
          :href="`#${item.id}`"
          :class="['toc-link', { 'toc-active': props.activeId === item.id }]">
          <span class="toc-text">{{ item.text }}</span>
        </a>
        <!-- 子目录 -->
        <div
          v-if="item.children && item.children.length"
          class="toc-sub-list">
          <CatagoryRecursion
            :catagory="item.children"
            :activeId="props.activeId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CatagoryRecursion from "./catagory-recursion.vue";
const props = defineProps(["catagory", "activeId"]);
// 滚动到指定章节
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
</script>

<style lang="scss" scoped>
.toc-content {
  overflow-y: auto;
  flex-grow: 1;
}
.toc-item {
  // margin-bottom: 0.5rem;

  .toc-link {
    display: block;
    padding: 0.375rem 0;
    color: #475569;
    text-decoration: none;
    transition: all 0.2s ease;

    .toc-text {
      margin-left: 0.25rem;
      // white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
    }

    &:hover {
      cursor: pointer;
      color: #fff;
      background-color: #b99364;
      border-radius: 5px;
    }
  }
  .toc-active {
    color: #fff;
    background-color: #b99364;
    font-weight: 500;
    border-radius: 5px;
    &::before {
      content: "";
      width: 2px;
      height: 100%;
      background-color: #222;
    }
  }
}

.toc-sub-list {
  margin-left: 1.5rem;
  margin-bottom: 0.25rem;
}

.toc-sub-item {
  margin-bottom: 0.25rem;

  .toc-link {
    font-size: 0.9375rem;
    color: #64748b;
  }
}

// 动画效果
.toc-item {
  transition: all 0.3s ease;
}

.toc-active {
  animation: all 0.3s ease;
}

@keyframes highlight {
  from {
    background-color: rgba(59, 130, 246, 0.1);
  }
  to {
    background-color: transparent;
  }
}
</style>
