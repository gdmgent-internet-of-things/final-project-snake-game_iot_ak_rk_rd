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

const snake1Input = document.getElementById("snake1Input");
const snake2Input = document.getElementById("snake2Input");
const snake3Input = document.getElementById("snake3Input");
const startGameButton = document.getElementById("startGameButton");

startGameButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const snake1Name = snake1Input.value;
  const snake2Name = snake2Input.value;
  const snake3Name = snake3Input.value;
  const score = 0;
  if (snake1Name.trim() !== "" && snake2Name.trim() !== "") {
    try {
      await commitHighscores([{
          name: snake1Name,
          score: 100
        },
        {
          name: snake2Name,
          score: 200
        },
        {
          name: snake3Name,
          score: 300
        }
      ]);
      await updateHighscores([{
          docId: "snake_1",
          name: snake1Name,
          score: score
        },
        {
          docId: "snake_2",
          name: snake2Name,
          score: score
        },
        {
          docId: "snake_3",
          name: snake3Name,
          score: score
        }
      ]);
      window.location.href = "/snake-game-3-players";
    } catch (error) {
      console.error("Error committing highscore:", error);
    }
  } else {
    alert("Please enter a name");
  }
});

async function updateHighscores(dataArray) {
  try {
    const highscoresRef = collection(db, "snake_game_3");

    for (const data of dataArray) {
      const {
        docId,
        name,
        score
      } = data;
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

async function commitHighscores(highscoreArray) {
  for (const {
      name,
      score
    } of highscoreArray) {
    try {
      const highscoresRef = collection(db, "high_scores");
      await addDoc(highscoresRef, {
        name,
        score
      });
      console.log("Highscore committed successfully");
    } catch (error) {
      console.error("Error committing highscore:", error);
    }
  }
}