<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="true"
      :showFile="false"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
    />
    <!-- </div> -->
  </div>
</template>

<script>
import { db, serverTime } from "../db.js";
import { authLogin } from "../db.js";
import CloseIcon from "vue-beautiful-chat/src/assets/close-icon.png";
import OpenIcon from "vue-beautiful-chat/src/assets/logo-no-bg.svg";
import FileIcon from "vue-beautiful-chat/src/assets/file.svg";
import CloseIconSvg from "vue-beautiful-chat/src/assets/close.svg";
// import Messeger from "./Messeger.vue";
export default {
  name: "Messeger",
  components: {
    // Messeger
  },
  props: {
    chatWhichWho: String,
    chatRoomRef:String,
    // participantsInfo:[],
  },
  data: () => {
    return {
      limit: 20,
      clickToChat: false,
      // testcurrentMe:chatWhichWho,
      icons: {
        open: {
          img: OpenIcon,
          name: "default"
        },
        close: {
          img: CloseIcon,
          name: "default"
        },
        file: {
          img: FileIcon,
          name: "default"
        },
        closeSvg: {
          img: CloseIconSvg,
          name: "default"
        }
      },
      participants: [], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl:
        "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
      messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        launcher: {
          bg: "#4e8cff"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true
    };
    //   basicInfo:[]
  },
  mounted: function() {
    this.getBothAvatar();
    this.gatherMess();
  },
  methods: {
    clickToOpen(){
      document.getElementsByClassName("sc-launcher")[0].click();
    },
    async getBothAvatar() {
      let me = await db
        .collection("user")
        .doc(authLogin.currentUser.email)
        .get();

      let other = await db
        .collection("user")
        .doc(this.chatWhichWho)
        .get();
      me = await me.data();
      other = await other.data();
      this.titleImageUrl = other.imageUrl;
      this.participants = [me, other];
      console.log(this.participants);
      this.clickToOpen();
    },
    gatherMess() {
      db.collection("message")
        .doc(this.chatRoomRef)
        .collection("messageList")
        .orderBy("serverTime", "asc")
        .onSnapshot(data => {
          let temperdocs = [];
          data.docs.forEach(doc => {
            let data = doc.data().message
            if (data.author == authLogin.currentUser.email) {
              data.author ="me"
            }
            temperdocs.push(data);
          });
          this.messageList = temperdocs;
        });
    },
    /*eslint no-mixed-spaces-and-tabs: [0, "smart-tabs"]*/
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: authLogin.currentUser.email,
          type: "text",
          data: { text }
        });
      }
    },
    async onMessageWasSent(message) {
      message.author = authLogin.currentUser.email;
      let data = {
        message,
        serverTime
      };
     await db.collection("message")
        .doc(this.chatRoomRef).update({serverTime})
      // console.log(serverTime);
      await db.collection("message")
        .doc(this.chatRoomRef)
        .collection("messageList")
        .add(
          data // Add in Server Time
        );
      //     // db.
      //   // called when the user sends a message
      //     this.messageList = [ ...this.messageList, message ]
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    handleScrollToTop() {
      this.limit += 10;
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      console.log("Emit typing event");
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
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
/* .clickme{
  
} */
</style>