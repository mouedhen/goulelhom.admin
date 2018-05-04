<template>
  <el-menu class="horizontal-menu"
           background-color="#CE1836"
           text-color="#f4f4f4"
           active-text-color="#f4f4f4"
           router
           mode="horizontal">

    <el-submenu index="1">
      <template slot="title">
        <i style="font-size: 1.5rem">
          <account-circle-icon/>
        </i>
        <span>{{user.name}}</span>
      </template>

      <!-- <el-menu-item index="/profile">
        <i style="font-size: 1.5rem">
          <account-edit-icon/>
        </i>
        <span>Modifier mon profil</span>
      </el-menu-item>
      -->

      <el-menu-item index="logout" @click="logout">
        <i style="font-size: 1.5rem">
          <logout-icon/>
        </i>
        <span>Se déconnecter</span>
      </el-menu-item>
    </el-submenu>

  </el-menu>
</template>

<script>

  import AccountCircleIcon from "vue-material-design-icons/account-circle"
  import AccountEditIcon from "vue-material-design-icons/account-edit"
  import LogoutIcon from "vue-material-design-icons/logout"
  import {User} from "../../models/users/User";

  export default {
    name: "horizontal-menu",
    components: {
      AccountCircleIcon,
      AccountEditIcon,
      LogoutIcon,
    },
    data() {
      return {
        user: new User()
      }
    },
    mounted() {
      (new User).isLoggedIn()
        .then(r => {
          if (r === true) {
            this.user.getProfile()
              .catch(e => {
                console.log(e);
                this.user.storage.remove('access-token');
                this.$router.push({name: 'index'})
              })
          }
        })
    },
    methods: {
      logout() {
        this.user.logout()
          .then(() => {
            this.$router.push({name: 'index'})
          })

      }
    },
  }
</script>

<style scoped>
  .material-design-icon {
    font-size: 1.5rem;
    margin-right: .2rem;
    margin-bottom: .6rem;
  }

  .material-design-icon, i {
    color: #f4f4f4;
  }
</style>
