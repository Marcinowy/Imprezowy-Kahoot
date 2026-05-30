# server.py
from flask import Flask, render_template, request, url_for, send_from_directory
from flask_socketio import SocketIO, emit
import random
from all_questions import questions
import signal

import RPi.GPIO as GPIO
import pigpio
import time


GPIO.setmode(GPIO.BCM)


"""Assigning names to specific pins"""
pumpPowerPIn = 23
servoPowerPIn = 24
servoSignalPin = 12
sensorPins = [25, 8, 7, 1]


"""Setting up pin operating modes"""   # do testowania bez elektroniki
GPIO.setup(pumpPowerPIn, GPIO.OUT)
GPIO.setup(servoPowerPIn, GPIO.OUT)
GPIO.setup(servoSignalPin, GPIO.OUT)
for pin in sensorPins:
    GPIO.setup(pin, GPIO.IN)

servo = pigpio.pi()
servo.set_mode(servoSignalPin, pigpio.OUTPUT)
servo.set_PWM_frequency(servoSignalPin, 50)


"""Turning off the pump and servo relays"""  # do testowania bez elektroniki
GPIO.output(pumpPowerPIn, GPIO.HIGH)
GPIO.output(servoPowerPIn, GPIO.HIGH)


""" number of pouring doses required to fill a glass"""
repetitions = 36
""" duration of single pouring dose"""
pour_dose = .25


app = Flask(__name__, static_folder='dist', static_url_path='')
socketio = SocketIO(app, cors_allowed_origins='*')

"""Store the list of players """
players = []

"""Store the list of players who have answered the current question"""
players_answered = []

"""Store the list of players who have answered the current question wrong"""
players_answered_wrong = []

""" How many questions one game has"""
question_limit = 5

""" Tells if the game began"""
game_started = False

"""Store the current question index"""
current_question_index = 0

""" Store the current game mode"""
game_mode = 'looserMode'  # default game mode, can be 'looserMode' or 'winnerMode'


"""function to set servo at a given angle"""
def servoGoToAngle(angle):
    d0, d180 = 500, 2500
    pulse = int(d0 + (d180 - d0) * (angle / 180))

    GPIO.output(servoPowerPIn, GPIO.LOW)
    print("servo on")  # [debug]
    time.sleep(.2)

    servo.set_servo_pulsewidth(servoSignalPin, pulse)
    print("Servo: setting angle:", angle, pulse)  # [debug]
    time.sleep(1)
    servo.set_PWM_dutycycle(servoSignalPin, 0)
    servo.set_PWM_frequency(servoSignalPin, 0)
    time.sleep(0.2)

    GPIO.output(servoPowerPIn, GPIO.HIGH)
    print("servo off")  # [debug]
    time.sleep(.1)


""" function to turn on a pump for a fixed time """
def pumpDrink(playerID):
    GPIO.output(pumpPowerPIn, GPIO.LOW)
    print("pump on")  # [debug]

    for i in range(repetitions):
        if GPIO.input(sensorPins[playerID - 1]) == GPIO.HIGH:
            break
        time.sleep(pour_dose)
        print("pumping", i + 1, "/", repetitions)  # [debug]

    GPIO.output(pumpPowerPIn, GPIO.HIGH)
    print("pump off")  # [debug]
    time.sleep(.1)


"""function for handling penalty for bad answers"""
def pourDrinks(stupidPlayersIds):
    global game_mode
    for player in players:
        playerID = player['id']

        if game_mode == 'looserMode' and playerID not in stupidPlayersIds:
            continue
        if game_mode == 'winnerMode' and playerID in stupidPlayersIds:
            continue

        print("Gracz nr", playerID)  # [debug]

        if GPIO.input(sensorPins[playerID - 1]) == GPIO.HIGH:
            print("Gracz", playerID, "nie dał kieliszka")  # [debug]
            player_name = next((p['username'] for p in players if p['id'] == playerID), 'Unknown')
            emit('didnt_drink', {'id': playerID, 'username': player_name}, broadcast=True)

            """Loop holding the pump untill the shot_glass is found in slot"""
            while GPIO.input(sensorPins[playerID - 1]) == GPIO.HIGH:
                time.sleep(2)
                emit('glass_provided', {'id': playerID}, broadcast=True)

        slotAngle = 20 + 30 * (playerID - 1)
        # 20, 50, 70, 90 - angles for 4 players, can be easily changed by modifying the formula above
        servoGoToAngle(slotAngle)
        time.sleep(1)

        pumpDrink(playerID)
        time.sleep(2)
    
    if game_mode == 'looserMode' and len(stupidPlayersIds) != 0:
        servoGoToAngle(0)
    if game_mode == 'winnerMode' and len(stupidPlayersIds) != len(players):
        servoGoToAngle(0)
    emit('drinks_poured', broadcast=True)


@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if path != "" and path.endswith(('.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico')):
        return send_from_directory('dist', path)
    return send_from_directory('dist', 'index.html')


@socketio.on('connect')
def handle_connect():
    emit('message', {'data': 'Connected'})


""" handling a request to join a lobby, sends id and updates players list if succeded, sends full_lobby message if failed"""
@socketio.on('join')
def handle_join(data):
    global game_started

    print("player tries to join") # DEBUG

    if len(players) < 4 and not game_started:
        username = data['username']
        player_sid = request.sid
        available_id = get_first_available_id()

        if available_id is not None:
            player_id = available_id
        else:
            player_id = len(players) + 1

        player = {
            'id': player_id, 
            'username': username, 
            'score': 0, 
            'sid': player_sid,
            'language': data['language']
        }
        players.append(player)

        print(players)

        emit('game_joined')
        emit('get_id', {'playerId': player['id']})
        emit('update_players', {'players': players}, broadcast=True)
        emit('message', {'data': f'Gracz {username} dołączył/a/o do gry.'}, broadcast=True)
    else:
        emit('lobby_full', {'message': 'Gra już się rozpoczęła lub lobby jest pełne. Spróbuj ponownie za chwilę.'})


""" clears data from previous game and starts a new one"""
@socketio.on('start_game')
def handle_start_game(data=None):
    global game_started, current_question_index, question_limit, game_mode
    print(f"[DEBUG] start_game called with data={data}")  # DEBUG
    if not game_started:
        # Get num_rounds from data if provided, otherwise use default
        if data and 'numRounds' in data:
            question_limit = int(data['numRounds'])
        if data and 'gameMode' in data:
            game_mode = data['gameMode']
        print(f"[DEBUG] question_limit set to {question_limit}")  # DEBUG
        current_question_index = 0
        for player in players:
            player['score'] = 0
        emit('update_players', {'players': players}, broadcast=True)
        emit('game_started', {'numRounds': question_limit, 'gameMode': game_mode}, broadcast=True)
        game_started = True
        print(f"[DEBUG] Calling shuffle_questions, total questions: {len(questions)}")  # DEBUG
        shuffle_questions()
        print(f"[DEBUG] About to emit_question")  # DEBUG
        emit_question()
        print(f"[DEBUG] Question emitted")  # DEBUG
    else:
        print("[DEBUG] Game already started, ignoring start_game call")  # DEBUG


""" makes sure that disconnecting doesn't break a game"""
@socketio.on('disconnect')
def handle_disconnect():
    global players
    disconnected_sid = request.sid
    disconnected_player = next((player for player in players if player['sid'] == disconnected_sid), None)

    if disconnected_player:
        players.remove(disconnected_player)
        emit('update_players', {'players': players}, broadcast=True)
        print(f"Player {disconnected_player['username']} disconnected.")

        if disconnected_player['id'] in players_answered:
            players_answered.remove(disconnected_player['id'])

            if disconnected_player['id'] in players_answered_wrong:
                players_answered_wrong.remove(disconnected_player['id'])  # [Jakub] usunąć z listy pijących

            print(players_answered)
            print(players)

        if len(players_answered) == len(players):
            emit('all_players_answered', broadcast=True)
            pourDrinks(players_answered_wrong)  # [Jakub] dodać włączenie nalewania w tym miejscu

            handle_next_question()

    if len(players) == 0:
        global game_started
        game_started = False


""" handles answer from single player"""
@socketio.on('answer')
def handle_answer(data):
    player_id = data['player_id']
    selected_option_id = data['answer']
    current_question = questions[current_question_index]
    correct_option_id = current_question['correct_option_id']

    if player_id not in players_answered:
        players_answered.append(player_id)

        if selected_option_id == correct_option_id:
            for player in players:
                if player['id'] == player_id:
                    player['score'] += 1
                    break
        else:
            players_answered_wrong.append(player_id)

        print(f"[DEBUG] Player {player_id} answered. Correct: {selected_option_id == correct_option_id}. Players answered: {players_answered}. Players answered wrong: {players_answered_wrong}")  # DEBUG
        emit('update_players', {'players': players}, broadcast=True)

        """ Check if all players have answered"""
        if len(players_answered) == len(players):
            for p in players:
                p_lang = p.get('language', 'pl')
                p_options = current_question['translations'][p_lang]['options']
                
                p_correct_option = next((opt for opt in p_options if opt['id'] == correct_option_id), None)
                p_correct_text = p_correct_option['text'] if p_correct_option else "???"

                payload = {
                    'correctAnswer': p_correct_text,
                    'wrongPlayerIds': players_answered_wrong
        }

                if current_question_index != question_limit - 1:
                    emit('all_players_answered', payload, room=p['sid'])
                else:
                    payload['players'] = players
                    emit('game_over', payload, room=p['sid'])
            pourDrinks(players_answered_wrong)

""" handles request for next question"""
@socketio.on('next_question')
def next_question():
    handle_next_question()


"""sends question to all players"""
def emit_question():
    print(f"[DEBUG] emit_question called, index={current_question_index}, total questions={len(questions)}")  # DEBUG
    if current_question_index < len(questions):
        question_data = questions[current_question_index]
        for player in players:
            lang = player.get('language', 'pl')
            
            translation = question_data['translations'].get(lang, question_data['translations']['pl'])
            
            emit('new_question', {
                'question': translation['question'],
                'options': translation['options'],
                'number': (current_question_index + 1)
            }, room=player['sid'])
    else:
        print(f"[ERROR] Question index {current_question_index} out of range!")  # DEBUG


def shuffle_questions():
    random.shuffle(questions)


"""returns lowest available id"""
def get_first_available_id():
    taken_ids = {player['id'] for player in players}
    all_ids = set(range(1, 5))
    available_ids = all_ids - taken_ids

    if available_ids:
        return min(available_ids)
    else:
        return None


""" picks new question if not last question, else ends the game"""
def handle_next_question():
    print("next question")
    global current_question_index
    global game_started
    current_question_index += 1
    players_answered.clear()
    # [Jakub] czyścić pijących
    players_answered_wrong.clear()

    if current_question_index < question_limit:
        emit_question()
    else:
        emit('game_over', {'players': players}, broadcast=True)
        game_started = False

""" one way (probably not the best) to reset GPIO pins XD """
def handler(sig, frame):
    print("Shutting down server...")
    GPIO.output(pumpPowerPIn, GPIO.HIGH)
    GPIO.output(servoPowerPIn, GPIO.HIGH)
    GPIO.cleanup()
    exit(0)


signal.signal(signal.SIGINT, handler)

if __name__ == '__main__':
   servoGoToAngle(0)
   socketio.run(app, port=5500, host="0.0.0.0", debug=False, use_reloader=False, allow_unsafe_werkzeug=True)