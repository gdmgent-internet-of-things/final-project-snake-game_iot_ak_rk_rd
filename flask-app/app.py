from flask import Flask, render_template
import subprocess
from firebase import db


app = Flask(__name__)

@app.route("/")
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

@app.route("/start_game", methods=["POST"])
def start_game():
    # Run the snake.py file as a separate process
    subprocess.Popen(["python", "snake1.py"])
    return render_template('game_started.html')

@app.route("/start_game2", methods=["POST"])
def start_game2():
    # Run the snake.py file as a separate process
    subprocess.Popen(["python", "snake2.py"])
    return render_template('game_started.html')

@app.route("/start_game3", methods=["POST"])
def start_game3():
    # Run the snake.py file as a separate process
    subprocess.Popen(["python", "snake3.py"])
    return render_template('game_started.html')

@app.route("/gameover")
def game_over():
    return render_template('game_over.html')

if __name__ == '__main__':
    app.run()

