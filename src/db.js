import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {Timestamp } from 'firebase'
// Get a Firestore instance
const init = firebase
  .initializeApp({
    apiKey: "AIzaSyC0SK_5ThQinJAarfCu_XSdvn7cbnXNZ1E",
    authDomain: "hsu-vue-demo.firebaseapp.com",
    databaseURL: "https://hsu-vue-demo.firebaseio.com",
    projectId: "hsu-vue-demo",
    storageBucket: "hsu-vue-demo.appspot.com",
    messagingSenderId: "713117846149",
    appId: "1:713117846149:web:5f384bf84cac176d3777ec"});
    
export const authprovider = new firebase.auth.GoogleAuthProvider();
export const firestoretimestamp = Timestamp;
export const db = init.firestore();
export const serverTime = firebase.firestore.FieldValue.serverTimestamp();
export const authLogin = init.auth();