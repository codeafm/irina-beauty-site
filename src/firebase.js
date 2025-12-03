// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVQKKTpPedM96t9g5STfsBfzHiZPn0r9M",
  authDomain: "vizajist-d14e9.firebaseapp.com",
  databaseURL: "https://vizajist-d14e9-default-rtdb.firebaseio.com",
  projectId: "vizajist-d14e9",
  storageBucket: "vizajist-d14e9.firebasestorage.app",
  messagingSenderId: "41440543110",
  appId: "1:41440543110:web:f74cea166634dd269b6c07",
  measurementId: "G-W89RMZLF83"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
