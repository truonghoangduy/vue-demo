import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'
import VueRouter from 'vue-router'
import Vuex from "vuex"

// Routing
import Login from './components/Login.vue'
import DashBoard from './components/DashBoard.vue'

// Chat UI
import Chat from 'vue-beautiful-chat'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Chat)
Vue.use(firestorePlugin)
const store = new Vuex.Store(
  {
    state: {
      authenticated: false
    },
    mutations: {
      setAuthentication(state, status) {
        state.authenticated = status;
      }
    }
  }
);
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Login, name: "login" },
    {
      path: '/dashboard', component: DashBoard, name: 'dashboard',
      beforeEnter: (to, from, next) => {
        if (store.state.authenticated == false) {
          next("/") // Login on the parma
        } else {
          next(); // Forward pass to dashboard
        }
      }
    }
  ]
})


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: router,
  store: store
}).$mount('#app')
export default router