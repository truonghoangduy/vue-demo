<template>
  <div>
    <!-- <div v-for="info in basicInfo " :key="info.message"></div> -->
    <div class="userNav">
      <div v-for="user in listOfAvaUser" :key="user.id" class="card">
        <img :src="user.imageUrl" class="avatarIcon" @click="chatTo(user)" />
        <h3>{{user.name}}</h3>
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
      clickToChat: false,
    };
    //   basicInfo:[]
  },
  mounted: function() {
    this.onlineStatus();
    this.listAvaUser();
  },
  methods: {
    onlineStatus(){
      setInterval(async ()=>{
              await db.collection("user").doc(authLogin.currentUser.email).update({serverTime})

      },5000)
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
    listAvaUser() {
      db.collection("user").orderBy("serverTime", "desc").onSnapshot(data => {
        let temperListofAvaUser = [];
        data.docs.forEach(doc => {
          if (doc.data().id != authLogin.currentUser.email) {
            temperListofAvaUser.push(doc.data());
          }
          // this.listOfAvaUser = temperListofAvaUser.sort((a,b)=>b.serverTime.seconds - a.serverTime.seconds);

          this.listOfAvaUser = temperListofAvaUser;
        });
      });
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
</style>