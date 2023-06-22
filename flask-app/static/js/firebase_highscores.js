// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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

// Get a list of scores from your database
async function getHighscores() {
  try {
    const scoresCol = collection(db, 'high_scores');
    const scoreSnapshot = await getDocs(scoresCol);
    const scoreList = scoreSnapshot.docs.map(doc => doc.data());
    console.log(scoreList);
    return scoreList;
  } catch (error) {
    console.error('Error getting high scores:', error);
    return [];
  }
}

getHighscores();

async function displayHighscores() {
  const highscoresDiv = document.getElementById('highscoresDiv');
  highscoresDiv.innerHTML = 'Loading high scores...';

  try {
    const highscores = await getHighscores();

    if (highscores.length > 0) {
      highscores.sort((a, b) => b.score - a.score); // Sort highscores in descending order

      highscoresDiv.innerHTML = '';

      highscores.forEach(score => {
        const scoreElement = document.createElement('p');
        scoreElement.textContent = `${score.name}: ${score.score}`;
        highscoresDiv.appendChild(scoreElement);
      });
    } else {
      highscoresDiv.innerHTML = 'No high scores found.';
    }
  } catch (error) {
    console.error('Error displaying high scores:', error);
    highscoresDiv.innerHTML = 'An error occurred while retrieving high scores.';
  }
}

displayHighscores();
