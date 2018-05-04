<template>
  <div>
    <h1>User profile</h1>
  </div>
</template>

<script>
  import {User} from "../../models/users/User";

  export default {
    name: "user-profile",
    data() {
      return {
        user: new User()
      }
    }
  }
</script>

<style scoped>

</style>
