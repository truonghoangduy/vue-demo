<template>
  <div>
    <!-- <div v-for="info in basicInfo " :key="info.message"></div> -->
    <!-- <div class="userNav">
      <div v-for="user in listOfAvaUser" :key="user.id" class="card">
        <img :src="user.imageUrl" class="avatarIcon" @click="chatTo(user)" />
        <h3>{{user.name}}</h3>
      </div>
    </div>-->
    <div
      class="beuti-text"
      style="font-weight:1000;font-size:30px"
    >👉 {{listOfAvaUser.length}} are online 🧑‍🚀</div>
    <div>
      <div class="grid-container grid-container--fill">
        <div class="grid-element" v-for="user in listOfAvaUser" :key="user.id">
          <div>
            <img :src="user.imageUrl" class="avatarIcon" @click="chatTo(user)" />
            <h4 style="color: black;" class="beuti-text">{{user.name}}</h4>
          </div>
        </div>
      </div>
    </div>
    <!-- <div> -->
    <div v-if="clickSOMEOnceToChat">
      <Messeger :chatWhichWho="this.choosenPerson" :chatRoomRef="this.messageRef" />
    </div>
  </div>
</template>

<script>
import { db, serverTime } from "../db.js";
import firebase from 'firebase/app'

import { authLogin } from "../db.js";
import Messeger from "./Messeger.vue";
export default {
  name: "DashBoard",
  components: {
    Messeger
  },
  data: () => {
    return {
      messageRef: String,
      choosenPerson: "",
      clickSOMEOnceToChat: false,
      listOfAvaUser: [],
      clickToChat: false
    };
    //   basicInfo:[]
  },
  mounted: function() {
    this.onlineStatus();
    this.listAvaUser();
  },
  methods: {
    onlineStatus() {
      setInterval(async () => {
        await db
          .collection("user")
          .doc(authLogin.currentUser.email)
          .update({ serverTime });
      }, 5000);
    },
    async checkRoom() {
      this.clickSOMEOnceToChat = false;
      let me = authLogin.currentUser.email;
      let other = this.choosenPerson;
      let messageUUID = [me, other].sort((a, b) => a.localeCompare(b));
      //   Flatten() to make roomUUID
      messageUUID = messageUUID.toString();
      console.log(messageUUID);
      let roomRef = await db
        .collection("message")
        .doc(messageUUID)
        .get();

      if (!roomRef.exists) {
        console.log("make new Room");
        await db
          .collection("message")
          .doc(messageUUID)
          .set({ serverTime });
      }
      this.messageRef = messageUUID;
    },
    async chatTo(user) {
      this.choosenPerson = user.id;
      await this.checkRoom();
      this.clickSOMEOnceToChat = true;
    },
    diff_secs(dt1) {
      let todayTime = new Date();
      var diff = (todayTime.getTime() - dt1.getTime()) / 1000;
      // diff /= 60;
      return Math.abs(Math.round(diff));
    },

    listAvaUser() {
      db.collection("user")
        // .orderBy("serverTime", "desc")
        .onSnapshot(data => {
          console.log("Tick");
          let temperListofAvaUser = [];
            data.docs.forEach(doc => {
              if (doc.data().id != authLogin.currentUser.email) {
                temperListofAvaUser.push(
                  doc.data({ serverTimestamps: "estimate" })
                );
              }
          }),
           this.listOfAvaUser = temperListofAvaUser.filter(vaule => {
              if (vaule.serverTime.seconds != null || vaule.serverTime.seconds!= undefined) {
                let convert = new firebase.firestore.Timestamp(vaule.serverTime.seconds,vaule.serverTime.nanoseconds)
                let timeOn = this.diff_secs(convert.toDate()
                );
                console.log({
                  "name":vaule.id,
                  "time":timeOn});
                if (timeOn < 400) {
                  return true;
                }
                return false;
              }
              return false;
            });
          
        }
      );
    }
  }
};
</script>

<style>
.userNav {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.card {
  flex: 0 0 auto;
  margin-right: 15px;
}
.avatarIcon {
  width: 12vw;
  height: 12vw;
}

.grid-container {
  display: grid;
}

.grid-container--fill {
  /* grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.grid-element:hover {
  background-color: aliceblue;
}
.grid-element {
  /* background-color: deepPink; */
  padding: 20px;
  color: #fff;
  border: 1px solid #fff;
}
.grid-element img {
  max-width: 5vw;
  max-height: 5vw;
}
.beuti-text {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  text-transform: uppercase;
}
</style>