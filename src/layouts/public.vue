<template>
  <el-container id="app">
    <el-row>
      <el-col :span="12" :offset="12">
        <router-view/>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    name: 'public',
    mounted() {
      // Echo.leave('auth-channel');
    }
  }
</script>

<style lang="scss" scoped>
  #app {
    background: #f4f4f4;
  }

  .el-row {
    width: 100%;
  }

  .el-col {
    background: #ffffff;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
