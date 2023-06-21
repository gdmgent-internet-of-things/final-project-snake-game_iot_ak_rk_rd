firebaseConfig = {
    
}

firebase.initializeApp(firebaseConfig);

// Get a reference to the high scores collection or node
var highScoresRef = firebase.database().ref("highscores");

// Create a query to retrieve the high scores in ascending order
var query = highScoresRef.orderByChild("score").limitToFirst(10);

// Execute the query and handle the results
query.on("value", function(snapshot) {
  // The snapshot will contain the high scores in ascending order
  snapshot.forEach(function(childSnapshot) {
    var highScore = childSnapshot.val();
    var highScoreElement = document.createElement("li");
    highScoreElement.innerHTML = highScore.name + " - " + highScore.score;

  });
});