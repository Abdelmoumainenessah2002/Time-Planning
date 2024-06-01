// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFWEXS6-BunP2Skh4B3ojX_ZoKOrCnFcg",
  authDomain: "time-planning-508f5.firebaseapp.com",
  projectId: "time-planning-508f5",
  storageBucket: "time-planning-508f5.appspot.com",
  messagingSenderId: "1026486811556",
  appId: "1:1026486811556:web:faacbb068400289c4a1f31"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
