<template>
  <template v-for="item in props.menuList" :key="item.path">
    <!-- 展示&&有子路由 -->
    <el-sub-menu v-if="!item.meta.hidden && item.children" :index="item.path">
      <template #title>
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="item.meta.icon"></use>
        </svg>
        <span>{{ item.meta.title }}</span>
      </template>
      <MenuList :menuList="item.children"></MenuList>
    </el-sub-menu>

    <!-- 隐藏&&有子路由 -->
    <template v-if="item.meta.hidden && item.children">
      <MenuList :menuList="item.children"></MenuList>
    </template>

    <!-- 展示&&无子路由 -->
    <el-menu-item
      v-if="!item.meta.hidden && !item.children"
      :index="item.path"
      @click="goRoute"
    >
      <template #title>
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="item.meta.icon"></use>
        </svg>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
import MenuList from "@/components/menu/menu-list.vue";
import { useRouter } from "vue-router";

const props = defineProps(["menuList"]);
const $router = useRouter();
const goRoute = (vc) => {
  $router.push(vc.index);
};
</script>

<style lang="scss" scoped>
.icon {
  margin-right: 0.8rem;
}
// .el-menu-item:active {
//   color: #409eff;
// }
</style>
