from flask import Flask, render_template
import subprocess
from firebase import db


app = Flask(__name__)

@app.route("/")
def uitleg_game():
    return render_template('uitleg_game.html')

@app.route("/besturing")
def uitleg_besturing():
    return render_template('uitleg_besturing.html')

@app.route("/start")
def start_scherm():
    return render_template('start_scherm.html')

@app.route("/1player")
def name_1player():
    return render_template('name_1player.html')

@app.route("/2players")
def name_2players():
    return render_template('name_2players.html')

@app.route("/3players")
def name_3players():
    return render_template('name_3players.html')

@app.route("/getscore", methods=["POST"])
def get_score():
    # Run the snake.py file as a separate process
    subprocess.Popen(["python", "snake1.py"])
    return render_template('get_score.html')

@app.route("/getscore2", methods=["POST"])
def get_score2():
    # Run the snake.py file as a separate process
    subprocess.Popen(["python", "snake2.py"])
    return render_template('get_score.html')

@app.route("/getscore3", methods=["POST"])
def get_score3():
    # Run the snake.py file as a separate process
    subprocess.Popen(["python", "snake3.py"])
    return render_template('get_score.html')

@app.route("/gameover")
def game_over():
    return render_template('game_over.html')

@app.route("/highscores")
def high_scores():
    return render_template('high_scores.html')

if __name__ == '__main__':
    app.run()

