<template>
  <div class="centered">
    <div>
      <img alt="Vue logo" src="../assets/logo.png" />
    </div>
    <div>
      <HelloWorld msg="Welcome to Vue.js Chat App" />
    </div>
    <div>
      <img src="../assets/btn_google.png" @click="login()" />
    </div>
  </div>
</template>

<script>
import { authLogin, authprovider } from "../db.js";
import HelloWorld from "./HelloWorld.vue";
// import router from "../main.js"

export default {
  name: "Login",
  components: {
    HelloWorld
  },

  methods: {
    async login() {
      let user = await authLogin.signInWithPopup(authprovider);
      if (user.credential != null) {
        this.$store.commit("setAuthentication", true);
        this.$router.replace({ name: "dashboard" });
      } else {
        console.log("The username and / or password is incorrect");
      }
    }
  }
};
</script>

<style spoce>
/* .div {
  display: block;
} */
.centered {
  min-width: 100vw;
  min-height: 100vh;
}
</style>