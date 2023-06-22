from flask import Flask, render_template, request
import subprocess
#from flask_socketio import SocketIO
#import RPi.GPIO as GPIO


# socketio = SocketIO(app)

# # Define button pins
# button_pin1 = 11
# button_pin2 = 10
# button_pin3 = 9
# button_pin4 = 8

# # Set up GPIO button
# GPIO.setmode(GPIO.BOARD)
# GPIO.setup(button_pin1, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # Replace `button_pin` with your actual pin number
# GPIO.setup(button_pin2, GPIO.IN, pull_up_down=GPIO.PUD_UP)
# GPIO.setup(button_pin3, GPIO.IN, pull_up_down=GPIO.PUD_UP)
# GPIO.setup(button_pin4, GPIO.IN, pull_up_down=GPIO.PUD_UP)
# @app.route('/')
# def index():
#     return render_template('snake_3.html')

# @socketio.on('connect')
# def handle_connect():
#     # Send GPIO button data when a client is connected
#     button_state = GPIO.input(button_pin1)
#     button_state = GPIO.input(button_pin2)
#     button_state = GPIO.input(button_pin3)
#     button_state = GPIO.input(button_pin4)
#     socketio.emit('button_state', button_state)





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

@app.route("/snake-game-1-player")
def snake_1():
    return render_template('snake_1.html')

@app.route("/snake-game-2-players")
def snake_2():
    return render_template('snake_2.html')

@app.route("/snake-game-3-players")
def snake_3():
    return render_template('snake_3.html')

@app.route("/highscores")
def high_scores():
    return render_template('high_scores.html')


if __name__ == '__main__':
    app.run()

