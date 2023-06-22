// Import the functions you need from the SDKs you need
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
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

const startGameButton = document.getElementById("startGameButton");
const playerNameInput = document.getElementById("player_name");

startGameButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const playerName = playerNameInput.value;
  const score = 0;
  if (playerName.trim() !== "") {
    try {
      await commitHighscore(playerName, score);
      await updateHighscore("snake", playerName, score);
      window.location.href = "/snake-game-1-player";
    } catch (error) {
      console.error("Error committing highscore:", error);
    }
  } else {
    alert("Please enter a name");
  }
});

async function updateHighscore(docId, name, score) {
  try {
    const highscoresRef = doc(db, "snake_game_1", docId);

    await updateDoc(highscoresRef, {
      name: name,
      score: score
    });

    console.log("Highscore updated successfully for ID:", docId);
  } catch (error) {
    console.error("Error updating highscore:", error);
  }
}

async function commitHighscore(name, score) {
  try {
    const highscoresRef = collection(db, "high_scores");

    const docRef = await addDoc(highscoresRef, {
      name: name,
      score: score
    });

    console.log("Highscore committed successfully with ID:", docRef.id);
  } catch (error) {
    console.error("Error committing highscore:", error);
  }
}