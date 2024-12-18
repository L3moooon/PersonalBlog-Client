<template>
  <div class="container">
    <el-menu>
      <MenuList :menuList="routes" router="true"></MenuList>
    </el-menu>
  </div>
</template>

<script setup>
import { routes } from "@/router/route";
import MenuList from "@/components/menu/menu-list.vue";
</script>

<style lang="scss" scoped>
// div {
//   background-color: red;
// }
.container {
  width: 15%;
}
.el-menu {
  border-radius: 10px;
}
</style>
