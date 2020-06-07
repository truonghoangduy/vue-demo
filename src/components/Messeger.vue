<template>
  <div>
    hello World
    <button @click="clicktest()"></button>
    <!-- <Login/> -->
  </div>
</template>

<script>
import { db } from '../db.js'

export default {
  name: "Messeger",
  data() {
    return {
      userRef: [],
    }
  },
  props: {
    msg: String
  },
  methods: {
    async clicktest() {
        let a = await db.collection("user").doc("d2RRTTqVfay9GFUfcC2j").get();
        console.log("Called")
        console.log(a.data())
    }
  },
firestore:{
    // userRef:db.collection("user").
}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
