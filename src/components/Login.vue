<template>
  <div class="centered">
    <div>
      <img alt="Vue logo" src="../assets/logo.png" @click="donePresentationMode()" />
    </div>
    <div>
      <HelloWorld msg="Welcome to Vue.js Chat App" />
    </div>
    <div>
      <img src="../assets/btn_google.png" @click="login()" />
    </div>
    <div class="centering">
      <div v-if="donePresentation">
        <div id="srolllocation"
          class="beuti-text"
          style="font-weight: 1000; line-height: 72px; margin: 0 0 24px; text-align: center; text-transform: uppercase;"
        >
          we are happy ❤️ to have
          👉 {{this.thankyouforEnter.length}} Participants in this presentation
        </div>
        <img
          src="../assets/kittycat.gif"
          loop=infinite
          
        />
        <div class="testing">
          <div class="grid-container grid-container--fill">
            <div class="grid-element" v-for="user in thankyouforEnter" :key="user.id">
              <div>
                <img :src="user.imageUrl" />
                <h4 style="color: black;" class="beuti-text">{{user.name}}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authLogin, authprovider, db, serverTime } from "../db.js";
import HelloWorld from "./HelloWorld.vue";

export default {
  name: "Login",
  data: function() {
    return {
      thankyouforEnter: [],
      donePresentation: false
    };
  },
  created: function() {},
  mounted: function() {
    this.getAllUser();
  },
  components: {
    HelloWorld
  },

  methods: {
    donePresentationMode() {
      this.donePresentation = !this.donePresentation;

      
      setTimeout(() => {
        document.getElementById("srolllocation").scrollIntoView()
      }, 200);
    },
    async getAllUser() {
      let users = await db.collection("user").get();
      let temperUsers = [];
      users.docs.forEach(doc => {
        temperUsers.push(doc.data());
      });
      this.thankyouforEnter = temperUsers;
      console.log(this.thankyouforEnter);
    },
    async login() {
      let user = await authLogin.signInWithPopup(authprovider);
      let currentUserAdd = {
        // temper JSON to firebase
        id: authLogin.currentUser.email, // As email to :))
        imageUrl: authLogin.currentUser.photoURL,
        name: authLogin.currentUser.displayName,
        serverTime
      };
      await db
        .collection("user")
        .doc(currentUserAdd["id"])
        .set(currentUserAdd);
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
.centering {
  margin-left: auto;
  margin-right: auto;
}
.beuti-text {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  text-transform: uppercase;
}
.centered {
  min-width: 100vw;
  min-height: 100vh;
}
.grid-container {
  display: grid;
}

.grid-container--fill {
  /* grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.grid-element {
  /* background-color: deepPink; */
  padding: 20px;
  color: #fff;
  border: 1px solid #fff;
}
.grid-element:hover {
  background-color: aliceblue;
}
.grid-element img {
  max-width: 5vw;
  max-height: 5vw;
}
</style>