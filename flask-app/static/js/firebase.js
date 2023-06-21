// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuu7gMlgZJQDSmmbiOf_tIBeYKkABFD8s",
  authDomain: "snake-iot.firebaseapp.com",
  projectId: "snake-iot",
  storageBucket: "snake-iot.appspot.com",
  messagingSenderId: "291589478883",
  appId: "1:291589478883:web:cdcd65e4ca40c8c735e8d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);