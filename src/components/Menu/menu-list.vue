<template>
  <template
    v-for="(item, index) in props.menuList"
    :key="item.path"
  >
    <el-sub-menu
      v-if="!item.meta.hidden && item.children"
      :index="item.path"
    >
      <template #title>
        <!-- <el-icon><location /></el-icon> -->
        <span>{{ item.meta.title }}</span>
      </template>
      <MenuList :menuList="item.children"></MenuList>
    </el-sub-menu>
    <!-- <el-sub-menu
      v-if="item.meta.hidden && item.children"
      :index="item.path"
    > -->
    <template v-if="item.meta.hidden && item.children">
      <MenuList :menuList="item.children"></MenuList>
    </template>

    <!-- </el-sub-menu> -->
    <el-menu-item
      v-if="!item.meta.hidden && !item.children"
      :index="index"
    >
      <template #title>
        <!-- <el-icon><location /></el-icon> -->
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
import MenuList from "@/components/Menu/menu-list.vue";
const props = defineProps(["menuList"]);
</script>

<style lang="scss" scoped></style>
