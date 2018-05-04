<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>administration</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'dashboard:index' }">tableau de bord</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="margin-top" id="visits-stats">
      <visits-stats />
    </div>
  </div>
</template>

<script>
  import VisitsStats from './blocks/VisitsStats'

  export default {
    name: "dashboard",
    components: {
      VisitsStats,
    }
  }
</script>

<style scoped>

</style>
