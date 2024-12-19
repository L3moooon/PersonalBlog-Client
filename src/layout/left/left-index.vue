<template>
  <div class="container">
    <el-menu popper-class="menu">
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
.menu {
}
.el-menu {
  border-radius: 10px;
  --el-font-family: Avenir, Helvetica, Arial, sans-serif;
  --el-menu-item-font-size: 0.75rem;
}
// .el-font-family {
//   font-family: Avenir, Helvetica, Arial, sans-serif;

//   /* text-align: center; */
//   color: #2c3e50;
// }
</style>
