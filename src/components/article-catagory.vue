<template>
  <div class="toc-container">
    <!-- 目录标题 -->
    <div class="toc-header">
      <h3 class="toc-title">
        <i
          class="fa fa-list-ul"
          aria-hidden="true"></i>
        目录
      </h3>
      <div class="progress-info">
        <span class="progress-percentage">{{ progress }}</span>
      </div>
    </div>
    <!-- 进度条和百分比 -->
    <div class="progress-section">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    <!-- 目录内容 -->
    <nav class="toc-content">
      <ul class="toc-list">
        <li
          v-for="(item, index) in tocItems"
          :key="index"
          :class="['toc-item', { 'toc-active': activeId === item.id }]"
          @click="scrollToSection(item.id)">
          <a
            :href="`#${item.id}`"
            class="toc-link">
            <span class="toc-text">{{ item.text }}</span>
          </a>
          <!-- 子目录 -->
          <ul
            v-if="item.children && item.children.length"
            class="toc-sub-list">
            <li
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :class="['toc-sub-item', { 'toc-active': activeId === child.id }]"
              @click="scrollToSection(child.id)">
              <a
                :href="`#${child.id}`"
                class="toc-link">
                <span class="toc-text">{{ child.text }}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { throttle } from "@/utils/throttle";
// 接收内容区域的选择器作为参数
const props = defineProps({
  contentSelector: {
    type: String,
    default: "#content",
  },
  // 要识别的标题标签，默认h1到h6
  headingTags: {
    type: Array,
    default: () => ["h1", "h2", "h3", "h4", "h5", "h6"],
  },
});

// 目录项数据
const tocItems = ref([]);
// 当前激活的目录项ID
const activeId = ref("");
// 浏览进度百分比
const progress = ref(0);
// 内容区域元素
// 所有标题元素及其位置信息
let headingPositions = [];
// 内容区域总高度
let contentTotalHeight = 0;
// 节流计时器
let throttleTimer = null;
const contentElement = ref(null); //文章内容dom
const containerElement = ref(null); //文章容器(包含标题)
// 生成目录和收集标题位置
const generateToc = () => {
  // 获取内容区域
  console.log(222);
  if (!contentElement.value) return;
  console.log(333);

  // 清空现有目录
  tocItems.value = [];
  headingPositions = [];

  // 收集所有标题元素
  let headingElements = [];
  props.headingTags.forEach((tag) => {
    const elements = contentElement.value.querySelectorAll(tag);
    headingElements.push(...Array.from(elements));
  });

  // 按在文档中的位置排序
  headingElements.sort((a, b) => a.offsetTop - b.offsetTop);

  // 为没有ID的标题生成ID
  headingElements.forEach((el) => {
    if (!el.id) {
      // 使用标题文本生成ID
      const text = el.textContent
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      el.id =
        text ||
        `heading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // 记录标题位置信息
    headingPositions.push({
      id: el.id,
      offsetTop: el.offsetTop,
      // 下一个标题的位置作为当前标题的结束位置
      nextOffsetTop: Infinity,
    });
  });

  // 设置每个标题的结束位置（下一个标题的起始位置）
  headingPositions.forEach((item, index) => {
    if (index < headingPositions.length - 1) {
      item.nextOffsetTop = headingPositions[index + 1].offsetTop;
    } else {
      // 最后一个标题的结束位置是内容区域底部
      item.nextOffsetTop = contentElement.value.scrollHeight;
    }
  });

  // 构建目录结构
  const stack = [];
  headingElements.forEach((el) => {
    const level = parseInt(el.tagName.replace("H", ""));
    const item = {
      id: el.id,
      text: el.textContent.trim(),
      level,
      children: [],
    };

    // 找到合适的父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      tocItems.value.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
    }

    stack.push(item);
  });
  console.log(444, tocItems);
};

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
// 处理滚动事件，更新当前激活的目录项和进度
const handleScroll = () => {
  // 计算滚动进度
  const scrollPosition = window.scrollY;
  const total =
    containerElement.value.getBoundingClientRect().height - window.innerHeight;
  const percentage = Math.min(Math.max(0, (scrollPosition / total) * 100), 100);
  progress.value = Math.round(percentage);
  // 确定当前激活的标题

  // 查找当前滚动位置所在的标题区间
  for (let i = 0; i < headingPositions.length; i++) {
    const current = headingPositions[i];
    // 检查滚动位置是否在当前标题的区间内（当前标题开始位置 <= 滚动位置 < 下一个标题开始位置）
    if (
      scrollPosition >= current.offsetTop &&
      scrollPosition < current.nextOffsetTop
    ) {
      activeId.value = current.id;
      break;
    }
  }
};

// 组件挂载时初始化
onMounted(() => {
  contentElement.value = document.getElementById("article-content");
  containerElement.value = document.getElementById("article-container");
  console.log(contentElement.value, containerElement.value);

  generateToc();
  window.addEventListener("scroll", throttle(handleScroll, 50));
  // 初始检查一次
  handleScroll();
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
.toc-container {
  min-height: 160px;
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  opacity: 0.9;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px 5px;
  // background-color: #fff;
  // border-radius: 8px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  // padding: 1.5rem;
  // max-height: calc(100vh - 3rem);
  // overflow: hidden;
  // display: flex;
  // flex-direction: column;
}

// 进度条样式
.progress-section {
  margin-bottom: 10px;

  .progress-bar {
    height: 3px;
    background-color: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background-color: #3b82f6;
      border-radius: 3px;
      transition: width 0.3s ease;
    }
  }
}

.toc-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .toc-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;

    i {
      margin-right: 0.5rem;
      color: #3b82f6;
    }
  }
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    position: relative;
    .progress-text {
      font-size: 0.875rem;
      color: #64748b;
    }

    .progress-percentage {
      position: absolute;
      right: 10px;
      font-size: 20px;
      font-weight: 500;
      color: #858282;
    }
  }
}

.toc-content {
  overflow-y: auto;
  flex-grow: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }
}

.toc-list,
.toc-sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 0.5rem;

  .toc-link {
    display: block;
    padding: 0.375rem 0;
    color: #475569;
    text-decoration: none;
    transition: all 0.2s ease;

    .toc-text {
      padding-left: 0.25rem;
    }

    &:hover {
      color: #3b82f6;
    }
  }

  &.toc-active {
    .toc-link {
      color: #3b82f6;
      font-weight: 500;
    }
  }
}

.toc-sub-list {
  padding-left: 1.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
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
  transition: all 0.2s ease;
}

.toc-active {
  animation: highlight 0.3s ease;
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
