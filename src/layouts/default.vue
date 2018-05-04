<template>
  <el-container id="app">
    <el-aside width="250px">
      <vertical-menu />
    </el-aside>
    <el-container>
      <el-header>
        <horizontal-menu />
      </el-header>
      <el-main id="container">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import VerticalMenu from './blocks/VerticalMenu'
  import HorizontalMenu from './blocks/HorizontalMenu'


  export default {
    name: 'default',
    components: {
      VerticalMenu,
      HorizontalMenu,
    },
    mounted() {
      Echo.channel('auth-channel')
        .listen('UserConnectionEvent', (e) => {
          console.log(e.name + 'was connected to the dashboard');
          this.$notify.info({
            title: 'Info',
            message: e.name + ' s\'est connecté...',
            position: 'bottom-right'
          });
        });
    }
  }
</script>

<style lang="scss">
  #app, .el-aside, .vertical-menu {
    height: 100vh;
  }

  #container {
    overflow-y: scroll;
  }

  .logo {
    text-align: center;
    height: 60px;
    line-height: 60px;
    h1 {
      margin: 0;
    }
  }

  .el-header {
    padding: 0;
  }

  .horizontal-menu {
    padding: 0 1rem;
    .el-menu-item, .el-submenu {
      float: right;
    }

    i {
      color: #f4f4f4;
    }
  }

  .el-main {
    background: #f8f8f8;
  }
</style>
