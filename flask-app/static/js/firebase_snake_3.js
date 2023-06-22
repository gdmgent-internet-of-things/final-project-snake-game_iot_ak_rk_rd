// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
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


async function updateHighscores(dataArray) {
  try {
    const highscoresRef = collection(db, "snake_game_3");

    for (const data of dataArray) {
      const { docId, name, score } = data;
      const docRef = doc(highscoresRef, docId);
      await updateDoc(docRef, {
        name: name,
        score: score
      });
      console.log("Highscore updated successfully for ID:", docId);
    }
  } catch (error) {
    console.error("Error updating highscores:", error);
  }
}

// Specify the data array with document IDs, field names, and values to update
const dataArray = [
  { docId: "snake_1", name: "test1", score: 100 },
  { docId: "snake_2", name: "test2", score: 200 },
  { docId: "snake_3", name: "test3", score: 300 }
];


const highscoreArray = [
  { name: "test1", score: 100 },
  { name: "test2", score: 200 },
  { name: "test3", score: 300 }
];

async function commitHighscores(highscoreArray) {
  for (const { name, score } of highscoreArray) {
    try {
      const highscoresRef = collection(db, "high_scores");
      const docRef = await addDoc(highscoresRef, { name, score });
      console.log("Highscore committed successfully with ID:", docRef.id);
    } catch (error) {
      console.error("Error committing highscore:", error);
    }
  }
}

await commitHighscores(highscoreArray);
