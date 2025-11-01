<template>
  <div class="about-container">
    <div class="t1">关于本站</div>
    <div>
      在2024年12月的某天无意翻到别人的博客，打开了新世界，心想自己也整一个，于是有了你所看到的
    </div>
    <GitCalendar />
    <div>
      冷知识：本站也有后台=>
      <a href="admin.willisblog.cn">地址</a>
    </div>
    <div>关于作者</div>
    <div>有疑问或者建议欢迎联系我1152818861@qq.com</div>
  </div>
</template>

<script setup>
import GitCalendar from "./GitCalendar.vue";
</script>

<style lang="scss" scoped>
.about-container {
  padding: 10px;
  .t1 {
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
