<template>
  <div class="container">
    <h1>Goulel'Hom</h1>
    <span class="note">Espace d'administration</span>
    <el-form style="margin-top: 2rem">

      <el-form-item label="Adresse e-mail" prop="email">
        <el-input placeholder="votre adresse e-mail"  v-model="user.email" />
      </el-form-item>

      <el-form-item label="Mot de passe" prop="password">
        <el-input type="password" placeholder="votre mot de passe" v-model="user.password" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">Se connecter</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import {User} from "../../models/users/User";

  export default {
    name: "index",
    data() {
      return {
        user: new User()
      }
    },
    methods: {
      login() {
        this.user.login()
          .then(() => {
            this.$message.info('Bienvenue dans votre espace d\'administration');
            this.$router.push({name: 'dashboard:index'})
          })
          .catch(e => {
            this.$message.error('Merci de vérifier vos identifiants');
            console.log(e)
          })
      }
    },
  }
</script>

<style scoped>
  .container {
    width: 100%;
    padding: 2rem;
    text-align: center;
  }

  .el-button {
    width: 100%;
  }
</style>
